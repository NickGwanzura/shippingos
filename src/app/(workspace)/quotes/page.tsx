import Link from "next/link";
import { prisma } from "@/lib/db";
import { fmtMoney, fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Table, Td } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { QuoteStatusBadge } from "@/lib/status";

export const metadata = { title: "Quotes" };

export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany({
    include: { customer: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Quotations"
        subtitle={`${quotes.length} quote${quotes.length === 1 ? "" : "s"}`}
        actions={<Button href="/quotes/new">New Quote</Button>}
      />

      <Card>
        <Table head={["Quote", "Customer", "Type", "Route", "Total", "Deposit", "Status", "Expires"]}>
          {quotes.map((q: any) => (
            <tr key={q.id} className="hover:bg-slate-50">
              <Td>
                <Link href={`/quotes/${q.id}`} className="font-semibold text-brand hover:underline">
                  {q.quoteNumber}
                </Link>
              </Td>
              <Td className="font-medium">{q.customer.fullName}</Td>
              <Td>{q.shipmentType}</Td>
              <Td className="max-w-[160px] truncate text-xs">
                {q.origin} → {q.destination}
              </Td>
              <Td className="tabular-nums font-medium">{fmtMoney(q.total)}</Td>
              <Td className="tabular-nums">{fmtMoney(q.depositRequired)}</Td>
              <Td><QuoteStatusBadge status={q.status} /></Td>
              <Td className="text-xs text-slate-400">{fmtDate(q.expiryDate)}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
