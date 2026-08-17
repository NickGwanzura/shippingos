import Link from "next/link";
import { prisma } from "@/lib/db";
import { dnum } from "@/lib/money";
import { fmtMoney, fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { InvoiceStatusBadge } from "@/lib/status";
import { add } from "@/lib/money";

export const metadata = { title: "Invoices" };

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: {
      customer: { select: { fullName: true } },
      shipment: { select: { shipmentNumber: true } },
    },
    orderBy: { invoiceDate: "desc" },
  });

  let totalOutstanding = 0;
  for (const i of invoices) totalOutstanding = add(totalOutstanding, dnum(i.balance));

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Invoices"
        subtitle={`${invoices.length} invoices · ${fmtMoney(totalOutstanding)} outstanding`}
      />

      <Card>
        <Table head={["Invoice", "Customer", "Shipment", "Date", "Due", "Total", "Paid", "Balance", "Status"]}>
          {invoices.map((i: any) => (
            <tr key={i.id} className="hover:bg-slate-50">
              <Td className="font-semibold text-slate-800">{i.invoiceNumber}</Td>
              <Td>{i.customer.fullName}</Td>
              <Td>
                <Link href={`/shipments/${i.shipmentId}`} className="text-xs text-brand hover:underline">
                  {i.shipment.shipmentNumber}
                </Link>
              </Td>
              <Td className="text-xs">{fmtDate(i.invoiceDate)}</Td>
              <Td className="text-xs">{fmtDate(i.dueDate)}</Td>
              <Td className="tabular-nums">{fmtMoney(i.total)}</Td>
              <Td className="tabular-nums text-emerald-600">{fmtMoney(i.amountPaid)}</Td>
              <Td className={`tabular-nums font-medium ${dnum(i.balance) > 0 ? "text-amber-600" : "text-slate-400"}`}>
                {fmtMoney(i.balance)}
              </Td>
              <Td><InvoiceStatusBadge status={i.status} /></Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
