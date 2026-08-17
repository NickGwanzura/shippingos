import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageSearch, Wallet, ArrowUpRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { getPortalData } from "@/lib/portal";
import { fmtMoney, fmtDate, timeAgo } from "@/lib/format";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { StatusBadge, PaymentStatusBadge } from "@/lib/status";
import { getCompanyConfig } from "@/lib/company";

export const metadata = { title: "My Shipments" };

export default async function PortalHomePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CLIENT") redirect("/portal/login");
  const data = await getPortalData(session.user.id);
  if (!data) redirect("/portal/login");
  const config = await getCompanyConfig();
  const { active, delivered, totalOutstanding, customer } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Welcome, {customer.fullName.split(" ")[0]}
        </h1>
        <p className="text-sm text-slate-500">
          Here is the latest on your shipments with {config.companyName}.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Active Shipments</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{active.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Delivered</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{delivered.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-slate-500">Outstanding Balance</p>
          <p className={`mt-1 text-2xl font-semibold tabular-nums ${dnum(totalOutstanding) > 0 ? "text-amber-600" : "text-emerald-600"}`}>
            {fmtMoney(totalOutstanding)}
          </p>
        </div>
      </div>

      {/* Active shipments */}
      <Card>
        <CardHeader title="My Active Shipments" subtitle="Track progress in real time" />
        <CardBody className="p-0">
          {active.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-400">
              You have no active shipments right now.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {active.map((s: any) => (
                <li key={s.id}>
                  <Link href={`/portal/shipments/${s.id}`} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-800">{s.shipmentNumber}</p>
                        <StatusBadge status={s.status} />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {s.shipmentType} · {s.origin} → {s.destination}
                      </p>
                      <p className="text-xs text-slate-400">
                        Expected arrival: {fmtDate(s.expectedArrival)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-right">
                      <div>
                        <p className="text-xs text-slate-400">Balance</p>
                        <p className="text-sm font-semibold tabular-nums text-slate-800">{fmtMoney(s.outstanding)}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-300" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      {/* Delivered */}
      {delivered.length > 0 && (
        <Card>
          <CardHeader title="My Delivered Shipments" />
          <CardBody className="space-y-3">
            {delivered.map((s: any) => (
              <Link key={s.id} href={`/portal/shipments/${s.id}`} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-800">{s.shipmentNumber}</p>
                  <p className="text-xs text-slate-400">{s.origin} → {s.destination}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PaymentStatusBadge status={s.paymentStatus} />
                  <span className="text-xs text-slate-400">{fmtDate(s.deliveredAt)}</span>
                </div>
              </Link>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Contact / support */}
      <Card className="bg-brand text-white">
        <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <PackageSearch className="h-6 w-6" />
            <div>
              <p className="font-semibold">Need help with a shipment?</p>
              <p className="text-sm text-white/70">
                Our team is ready to assist · {config.supportPhone}
              </p>
            </div>
          </div>
          <a
            href={`mailto:${config.supportEmail}`}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-brand"
          >
            Contact Support
          </a>
        </CardBody>
      </Card>
    </div>
  );
}

function dnum(v: any): number {
  return v && typeof v.toNumber === "function" ? v.toNumber() : Number(v ?? 0);
}
