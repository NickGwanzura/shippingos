import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fmtMoney, fmtDate } from "@/lib/format";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { StatusBadge, PaymentStatusBadge } from "@/lib/status";
import { StatusTimeline } from "@/components/shipments/status-timeline";

export const metadata = { title: "Track Shipment" };

export default async function PortalShipmentPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await Promise.resolve(params);
  const session = await auth();
  if (!session?.user || session.user.role !== "CLIENT") redirect("/portal/login");

  // Only the owning customer can view (customerId == session user id).
  const ship = await prisma.shipment.findFirst({
    where: { id, customerId: session.user.id },
    include: {
      documents: { where: { isDemo: true } },
      supportNotes: { where: { isInternal: false } },
      payments: { orderBy: { date: "desc" } },
      invoices: true,
    },
  });
  if (!ship) notFound();

  const s: any = ship;

  return (
    <div className="space-y-5">
      <Link href="/portal" className="inline-flex items-center gap-1.5 text-sm text-brand">
        <ArrowLeft className="h-4 w-4" /> Back to my shipments
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{s.shipmentNumber}</h1>
            <p className="text-sm text-slate-500">{s.shipmentType} · {s.origin} → {s.destination}</p>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={s.status} />
              <PaymentStatusBadge status={s.paymentStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader title="Shipment Progress" subtitle="Where your cargo is right now" />
        <CardBody>
          <StatusTimeline status={s.status} />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="space-y-5 md:col-span-2">
          {/* Key detail */}
          <Card>
            <CardHeader title="Shipment Details" />
            <CardBody>
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div><p className="text-xs text-slate-400">Origin</p><p className="font-medium">{s.origin}</p></div>
                <div><p className="text-xs text-slate-400">Destination</p><p className="font-medium">{s.destination}</p></div>
                <div><p className="text-xs text-slate-400">Carrier</p><p className="font-medium">{s.carrier ?? "—"}</p></div>
                <div><p className="text-xs text-slate-400">Vessel</p><p className="font-medium">{s.vessel ?? "—"}</p></div>
                <div><p className="text-xs text-slate-400">Tracking Ref</p><p className="font-medium">{s.trackingReference ?? "—"}</p></div>
                <div><p className="text-xs text-slate-400">Container</p><p className="font-medium">{s.containerNumber ?? "—"}</p></div>
                <div><p className="text-xs text-slate-400">Departure</p><p className="font-medium">{fmtDate(s.departureDate)}</p></div>
                <div><p className="text-xs text-slate-400">Expected Arrival</p><p className="font-medium">{fmtDate(s.expectedArrival)}</p></div>
                <div><p className="text-xs text-slate-400">Actual Arrival</p><p className="font-medium">{fmtDate(s.actualArrival)}</p></div>
              </div>
              {s.vehicleRegistration && (
                <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
                  <p className="text-xs text-slate-400">Vehicle</p>
                  <p className="font-medium">{s.make ?? ""} {s.model ?? ""} · {s.vehicleRegistration}{s.vin ? ` · VIN ${s.vin}` : ""}</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Payments */}
          <Card>
            <CardHeader title="Payments & Receipts" />
            <CardBody className="space-y-2">
              {s.payments.length === 0 && <p className="text-sm text-slate-400">No payments received yet.</p>}
              {s.payments.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                  <div>
                    <p className="font-medium text-slate-800">{fmtMoney(p.amount)}</p>
                    <p className="text-xs text-slate-400">
                      Receipt {p.receiptNumber ?? "—"} · {p.method.replace(/_/g, " ")} · {fmtDate(p.date)}
                    </p>
                  </div>
                  {p.receiptNumber && (
                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Receipt
                    </span>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Original docs */}
          <Card>
            <CardHeader title="Your Documents" subtitle="Accessible files for this shipment" />
            <CardBody className="space-y-2">
              {s.documents.length === 0 && <p className="text-sm text-slate-400">No documents available yet.</p>}
              {s.documents.map((d: any) => (
                <div key={d.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <FileText className="h-4 w-4 shrink-0 text-brand" />
                  <span className="text-sm font-medium text-slate-800">{d.fileName}</span>
                  <span className="ml-auto text-xs text-slate-400">{d.type.replace(/_/g, " ")}</span>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader title="Updates" subtitle="Messages from Horizon Freight" />
            <CardBody className="space-y-3">
              {s.supportNotes.length === 0 && <p className="text-sm text-slate-400">No updates yet.</p>}
              {s.supportNotes.map((n: any) => (
                <div key={n.id} className="border-l-2 border-brand pl-3">
                  <p className="text-sm text-slate-700">{n.note}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{fmtDate(n.createdAt)}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Right: payment summary */}
        <div className="space-y-5">
          <Card>
            <CardHeader title="Payment Summary" />
            <CardBody className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Invoice Total</span>
                <span className="font-medium">{fmtMoney(s.invoiceTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-medium text-emerald-600">{fmtMoney(s.amountPaid)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-sm">
                <span className="font-medium text-slate-700">Outstanding</span>
                <span className={`font-semibold tabular-nums ${dnum(s.outstanding) > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                  {fmtMoney(s.outstanding)}
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Invoices" />
            <CardBody className="space-y-2">
              {s.invoices.map((inv: any) => (
                <div key={inv.id} className="rounded-lg border border-slate-100 p-3">
                  <p className="font-medium text-slate-800">{inv.invoiceNumber}</p>
                  <p className="text-xs text-slate-400">Balance {fmtMoney(inv.balance)}</p>
                </div>
              ))}
              {s.invoices.length === 0 && <p className="text-sm text-slate-400">No invoices.</p>}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function dnum(v: any): number {
  return v && typeof v.toNumber === "function" ? v.toNumber() : Number(v ?? 0);
}
