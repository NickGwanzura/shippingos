import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { add, dnum } from "@/lib/money";
import { fmtMoney, fmtDate, timeAgo } from "@/lib/format";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PaymentStatusBadge } from "@/lib/status";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Customer Detail" };

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await Promise.resolve(params);
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      shipments: {
        orderBy: { createdAt: "desc" },
        include: { invoices: true, expenses: true, payments: true },
      },
      quotes: { orderBy: { createdAt: "desc" }, take: 5 },
      invoices: true,
      supportNotes: { include: { createdBy: { select: { name: true } } } },
    },
  });
  if (!customer) notFound();

  const c: any = customer;
  let lifetimeValue = 0;
  for (const s of c.shipments) lifetimeValue = add(lifetimeValue, dnum(s.amountPaid));
  let outstanding = 0;
  for (const i of c.invoices) outstanding = add(outstanding, dnum(i.balance));
  const shipmentCount = c.shipments.length;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <Button href="/customers" variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
        Back to customers
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{c.fullName}</h1>
          {c.businessName && <p className="text-sm text-slate-500">{c.businessName}</p>}
          <div className="mt-1 flex flex-wrap gap-2">
            <Badge tone="brand">{c.customerType.replace(/_/g, " ")}</Badge>
            <Badge tone="slate">{c.country}</Badge>
            {c.portalEnabled && <Badge tone="green">Portal enabled</Badge>}
          </div>
        </div>
        <Button href="/shipments/new" variant="secondary" size="sm" icon={<Plus className="h-4 w-4" />}>
          New Shipment
        </Button>
      </div>

      {/* Contacts */}
      <Card>
        <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div><p className="text-xs text-slate-500">Phone</p><p className="text-sm font-medium">{c.phone}</p></div>
          <div><p className="text-xs text-slate-500">WhatsApp</p><p className="text-sm font-medium">{c.whatsapp ?? "—"}</p></div>
          <div><p className="text-xs text-slate-500">Email</p><p className="text-sm font-medium">{c.email ?? "—"}</p></div>
          <div className="sm:col-span-3"><p className="text-xs text-slate-500">Address</p><p className="text-sm font-medium">{c.address ?? "—"}</p></div>
        </CardBody>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Shipments</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{shipmentCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Lifetime Value</p>
          <p className="mt-1 text-2xl font-semibold text-brand tabular-nums">{fmtMoney(lifetimeValue)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Outstanding</p>
          <p className={`mt-1 text-2xl font-semibold tabular-nums ${outstanding > 0 ? "text-amber-600" : "text-slate-900"}`}>
            {fmtMoney(outstanding)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Shipments */}
          <Card>
            <CardHeader title="Shipments" subtitle={`${shipmentCount} total`} />
            <CardBody className="p-0">
              <ul className="divide-y divide-slate-100">
                {c.shipments.map((s: any) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div>
                      <Link href={`/shipments/${s.id}`} className="font-semibold text-brand hover:underline">
                        {s.shipmentNumber}
                      </Link>
                      <p className="text-xs text-slate-400">{s.shipmentType} · {s.origin} → {s.destination}</p>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <StatusBadge status={s.status} />
                      <span className="w-20 text-xs font-medium tabular-nums">
                        {fmtMoney(s.invoiceTotal)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Quotes */}
          <Card>
            <CardHeader title="Quotations" subtitle="Recent quotes" />
            <CardBody className="space-y-2 p-0">
              <ul className="divide-y divide-slate-100">
                {c.quotes.map((q: any) => (
                  <li key={q.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <Link href={`/quotes/${q.id}`} className="font-medium text-brand hover:underline">
                        {q.quoteNumber}
                      </Link>
                      <p className="text-xs text-slate-400">{q.cargoDescription}</p>
                    </div>
                    <span className="tabular-nums font-medium">{fmtMoney(q.total)}</span>
                  </li>
                ))}
                {c.quotes.length === 0 && <li className="px-5 py-3 text-sm text-slate-400">No quotes yet.</li>}
              </ul>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          {/* Notes */}
          <Card>
            <CardHeader title="Notes & Support" />
            <CardBody className="space-y-3">
              {c.supportNotes.map((n: any) => (
                <div key={n.id} className="border-l-2 border-brand pl-3">
                  <p className="text-sm text-slate-700">{n.note}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {n.isInternal ? "Internal" : "Customer"} · {n.createdBy?.name ?? "—"} · {timeAgo(n.createdAt)}
                  </p>
                </div>
              ))}
              {c.supportNotes.length === 0 && <p className="text-sm text-slate-400">No notes.</p>}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
