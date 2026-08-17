import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { GlobalSearch } from "@/components/search/global-search";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const sp = await Promise.resolve(searchParams);
  const q = sp.q?.trim() ?? "";
  const term = q;

  let shipments: any[] = [];
  let customers: any[] = [];
  let invoices: any[] = [];
  let quotes: any[] = [];

  if (term && term.length >= 2) {
    const contains = { contains: term, mode: "insensitive" as const };
    const [s, c, i, qi] = await Promise.all([
      prisma.shipment.findMany({
        where: {
          OR: [
            { shipmentNumber: contains },
            { trackingReference: contains },
            { containerNumber: contains },
            { vehicleRegistration: contains },
            { vin: contains },
            { customer: { fullName: contains } },
          ],
        },
        include: { customer: { select: { fullName: true } } },
        take: 20,
      }),
      prisma.customer.findMany({
        where: {
          OR: [{ fullName: contains }, { phone: contains }, { email: contains }, { businessName: contains }],
        },
        take: 20,
      }),
      prisma.invoice.findMany({
        where: { OR: [{ invoiceNumber: contains }, { customer: { fullName: contains } }] },
        include: { customer: { select: { fullName: true } } },
        take: 20,
      }),
      prisma.quote.findMany({
        where: { OR: [{ quoteNumber: contains }, { customer: { fullName: contains } }] },
        include: { customer: { select: { fullName: true } } },
        take: 20,
      }),
    ]);
    shipments = s;
    customers = c;
    invoices = i;
    quotes = qi;
  }

  const total = shipments.length + customers.length + invoices.length + quotes.length;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Global Search" subtitle="Find customers, shipments, invoices, quotes" />
      <GlobalSearch query={term} />
      {term && (
        <p className="mt-4 text-sm text-slate-500">
          {total} result{total === 1 ? "" : "s"} for “{term}”
        </p>
      )}
      <div className="mt-5 space-y-6">
        {customers.length > 0 && (
          <Card>
            <div className="border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase text-slate-500">Customers</div>
            <ul className="divide-y divide-slate-100">
              {customers.map((c) => (
                <li key={c.id} className="px-5 py-3">
                  <Link href={`/customers/${c.id}`} className="font-medium text-brand hover:underline">{c.fullName}</Link>
                  <p className="text-xs text-slate-400">{c.phone} · {c.email ?? ""}</p>
                </li>
              ))}
            </ul>
          </Card>
        )}
        {shipments.length > 0 && (
          <Card>
            <div className="border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase text-slate-500">Shipments</div>
            <ul className="divide-y divide-slate-100">
              {shipments.map((s) => (
                <li key={s.id} className="px-5 py-3">
                  <Link href={`/shipments/${s.id}`} className="font-medium text-brand hover:underline">{s.shipmentNumber}</Link>
                  <p className="text-xs text-slate-400">{s.customer.fullName} · {s.origin} → {s.destination}</p>
                </li>
              ))}
            </ul>
          </Card>
        )}
        {invoices.length > 0 && (
          <Card>
            <div className="border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase text-slate-500">Invoices</div>
            <ul className="divide-y divide-slate-100">
              {invoices.map((i) => (
                <li key={i.id} className="px-5 py-3">
                  <span className="font-medium text-slate-800">{i.invoiceNumber}</span>
                  <span className="text-xs text-slate-400"> · {i.customer.fullName}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
        {quotes.length > 0 && (
          <Card>
            <div className="border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase text-slate-500">Quotes</div>
            <ul className="divide-y divide-slate-100">
              {quotes.map((q) => (
                <li key={q.id} className="px-5 py-3">
                  <Link href={`/quotes/${q.id}`} className="font-medium text-brand hover:underline">{q.quoteNumber}</Link>
                  <span className="text-xs text-slate-400"> · {q.customer.fullName}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
        {term && total === 0 && (
          <Card><p className="px-5 py-8 text-center text-sm text-slate-400">No results found.</p></Card>
        )}
      </div>
    </div>
  );
}
