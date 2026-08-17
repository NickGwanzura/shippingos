import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  User,
  FileText,
  Banknote,
  Wallet,
  ReceiptText,
  FolderOpen,
  MessageSquare,
  Activity,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { fmtMoney, fmtDate, fmtDateTime, timeAgo } from "@/lib/format";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PaymentStatusBadge } from "@/lib/status";
import { StatusTimeline } from "@/components/shipments/status-timeline";
import { StatusUpdateControl } from "@/components/shipments/status-update";
import { RecordPaymentForm } from "@/components/shipments/record-payment-form";
import { AddExpenseForm } from "@/components/shipments/add-expense-form";
import { AddNoteForm } from "@/components/shipments/add-note-form";
import { AddDocumentForm } from "@/components/shipments/add-document-form";
import { DemoFlag } from "@/components/ui/demo-flag";

export const metadata = { title: "Shipment Detail" };

export default async function ShipmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await Promise.resolve(params);
  const ship = await prisma.shipment.findUnique({
    where: { id },
    include: {
      customer: true,
      assignedStaff: { select: { name: true } },
      invoices: true,
      payments: { orderBy: { date: "desc" } },
      expenses: { orderBy: { date: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
      supportNotes: {
        orderBy: { createdAt: "desc" },
        include: { createdBy: { select: { name: true } } },
      },
      activity: {
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { name: true } } },
      },
    },
  });
  if (!ship) notFound();

  const s = ship as any;
  const revenue = Number(s.revenue);
  const expensesTotal = Number(s.expensesTotal);
  const profit = Number(s.profit);
  const profitMargin = Number(s.profitMargin);

  const rows = [
    ["Shipment Type", s.shipmentType],
    ["Origin", s.origin],
    ["Destination", s.destination],
    ["Carrier", s.carrier],
    ["Vessel", s.vessel],
    ["Container", s.containerNumber],
    ["Tracking", s.trackingReference],
    ["Departure", fmtDate(s.departureDate)],
    ["Expected Arrival", fmtDate(s.expectedArrival)],
    ["Assigned Staff", s.assignedStaff?.name ?? "—"],
  ];
  if (s.vehicleRegistration) rows.push(["Vehicle", s.vehicleRegistration]);
  if (s.vin) rows.push(["VIN", s.vin]);
  if (s.make) rows.push(["Make/Model", `${s.make} ${s.model ?? ""}`]);
  if (s.weight) rows.push(["Weight", `${s.weight} kg`]);
  if (s.volume) rows.push(["Volume", `${s.volume} m³`]);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <Button href="/shipments" variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
        Back to shipments
      </Button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{s.shipmentNumber}</h1>
            <p className="text-sm text-slate-500">
              {s.make ? `${s.make} ${s.model ?? ""} · ` : ""}
              {s.customer.fullName} · {s.origin} → {s.destination}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={s.status} />
              <PaymentStatusBadge status={s.paymentStatus} />
              <DemoFlag show={s.isDemo} />
            </div>
          </div>
        </div>
        <StatusUpdateControl shipmentId={s.id} current={s.status} />
      </div>

      {/* Status timeline */}
      <Card>
        <CardHeader title="Shipment Timeline" subtitle="Real-time progress along the pipeline" />
        <CardBody>
          <StatusTimeline status={s.status} />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-5 lg:col-span-2">
          {/* Financials */}
          <Card>
            <CardHeader title="Financial Summary" subtitle="Confirmed transaction figures" />
            <CardBody>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Invoice Total</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{fmtMoney(s.invoiceTotal)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Amount Paid</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-600">{fmtMoney(s.amountPaid)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Outstanding</p>
                  <p className="mt-1 text-lg font-semibold text-amber-600">{fmtMoney(s.outstanding)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Expected Arrival</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{fmtDate(s.expectedArrival)}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Profitability */}
          <Card className={profit >= 0 ? "" : "border-red-200"}>
            <CardHeader
              title="Shipment Profitability"
              subtitle="Revenue less expenses"
              action={
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${profit >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {profitMargin.toFixed(1)}% margin
                </span>
              }
            />
            <CardBody>
              <div className="grid grid-cols-4 gap-4">
                <div><p className="text-xs text-slate-500">Revenue</p><p className="mt-1 text-lg font-semibold">{fmtMoney(revenue)}</p></div>
                <div><p className="text-xs text-slate-500">Expenses</p><p className="mt-1 text-lg font-semibold">{fmtMoney(expensesTotal)}</p></div>
                <div><p className="text-xs text-slate-500">Profit</p><p className={`mt-1 text-lg font-semibold ${profit >= 0 ? "text-emerald-600" : "text-red-600"}`}>{fmtMoney(profit)}</p></div>
                <div><p className="text-xs text-slate-500">Margin</p><p className="mt-1 text-lg font-semibold text-brand">{profitMargin.toFixed(1)}%</p></div>
              </div>
            </CardBody>
          </Card>

          {/* Invoices & Payments */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Card>
              <CardHeader title="Invoices" subtitle="Billing for this shipment" />
              <CardBody className="space-y-3">
                {s.invoices.length === 0 && (
                  <p className="text-sm text-slate-400">No invoices raised yet.</p>
                )}
                {s.invoices.map((inv: any) => (
                  <div key={inv.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <Link href={`/invoices`} className="font-semibold text-brand hover:underline">
                        {inv.invoiceNumber}
                      </Link>
                      <span className="text-xs text-slate-400">{fmtDate(inv.invoiceDate)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-sm">
                      <span className="text-slate-500">Total</span>
                      <span>{fmtMoney(inv.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Balance</span>
                      <span className="text-amber-600">{fmtMoney(inv.balance)}</span>
                    </div>
                  </div>
                ))}
                {s.paymentStatus !== "PAID" && (
                  <RecordPaymentForm shipmentId={s.id} />
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Payments" subtitle="Money received" />
              <CardBody className="space-y-2">
                {s.payments.length === 0 && (
                  <p className="text-sm text-slate-400">No payments recorded.</p>
                )}
                {s.payments.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{fmtMoney(p.amount)}</p>
                      <p className="text-xs text-slate-400">
                        {p.reference ?? p.receiptNumber} · {p.method.replace(/_/g, " ")} · {fmtDate(p.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          {/* Expenses */}
          <Card>
            <CardHeader
              title="Expenses"
              subtitle={`${fmtMoney(expensesTotal)} total incurred`}
            />
            <CardBody>
              <AddExpenseForm shipmentId={s.id} />
              <ul className="mt-4 space-y-2">
                {s.expenses.map((e: any) => (
                  <li key={e.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {e.category.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-slate-400">
                        {e.supplier ?? "—"} · {fmtDate(e.date)}
                      </p>
                    </div>
                    <span className="tabular-nums font-medium text-slate-900">{fmtMoney(e.amount)}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader title="Documents" subtitle="Bill of lading, invoices, certificates…" />
            <CardBody>
              <AddDocumentForm shipmentId={s.id} />
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {s.documents.map((d: any) => (
                  <li key={d.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                    <FolderOpen className="h-4 w-4 shrink-0 text-brand" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{d.fileName}</p>
                      <p className="text-xs text-slate-400">{d.type.replace(/_/g, " ")}</p>
                    </div>
                    <span className="text-[11px] text-slate-400">{timeAgo(d.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Shipment details */}
          <Card>
            <CardHeader title="Details" subtitle="Shipment information" />
            <CardBody>
              <dl className="space-y-2.5">
                {rows.map(([k, v]) => (
                  <div key={k as string} className="flex justify-between gap-2 text-sm">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-right font-medium text-slate-800">{v as string}</dd>
                  </div>
                ))}
                {s.notes && (
                  <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{s.notes}</div>
                )}
              </dl>
            </CardBody>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader title="Customer" />
            <CardBody className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <Link href={`/customers/${s.customer.id}`} className="font-medium text-brand hover:underline">
                  {s.customer.fullName}
                </Link>
              </div>
              {s.customer.businessName && <p className="text-sm text-slate-500">{s.customer.businessName}</p>}
              <p className="text-sm text-slate-500">{s.customer.phone}</p>
              {s.customer.email && <p className="text-sm text-slate-500">{s.customer.email}</p>}
            </CardBody>
          </Card>

          {/* Support notes */}
          <Card>
            <CardHeader
              title="Notes & Updates"
              action={<MessageSquare className="h-4 w-4 text-slate-400" />}
            />
            <CardBody>
              <AddNoteForm shipmentId={s.id} />
              <ul className="mt-4 space-y-3">
                {s.supportNotes.map((n: any) => (
                  <li key={n.id} className="border-l-2 border-brand pl-3">
                    <p className="text-sm text-slate-700">{n.note}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {n.isInternal ? "Internal" : "Customer"} · {n.createdBy?.name ?? "—"} · {timeAgo(n.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader title="Activity" action={<Activity className="h-4 w-4 text-slate-400" />} />
            <CardBody className="p-0">
              <ul className="divide-y divide-slate-100">
                {s.activity.map((a: any) => (
                  <li key={a.id} className="flex gap-3 px-5 py-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                    <div>
                      <p className="text-sm text-slate-700">{a.description}</p>
                      <p className="text-xs text-slate-400">{a.actor?.name ?? "System"} · {timeAgo(a.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
