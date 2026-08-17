import { prisma } from "@/lib/db";
import { add, dnum } from "@/lib/money";
import { fmtMoney, fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td } from "@/components/ui/table";
import { Card, CardBody } from "@/components/ui/card";
import Link from "next/link";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";

export const metadata = { title: "Expenses" };

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({
    include: { shipment: { select: { shipmentNumber: true, customer: { select: { fullName: true } } } } },
    orderBy: { date: "desc" },
  });

  let total = 0;
  for (const e of expenses) total = add(total, dnum(e.amount));
  const byCat: Record<string, number> = {};
  for (const e of expenses) byCat[e.category] = add(byCat[e.category] ?? 0, dnum(e.amount));

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Expenses"
        subtitle={`${expenses.length} records · ${fmtMoney(total)} total`}
      />

      <Card className="mb-5">
        <CardBody className="flex flex-wrap gap-3">
          {Object.entries(byCat)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amt]) => (
              <div key={cat} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <span className="text-slate-500">{EXPENSE_CATEGORY_LABELS[cat] ?? cat}: </span>
                <span className="font-semibold tabular-nums">{fmtMoney(amt)}</span>
              </div>
            ))}
        </CardBody>
      </Card>

      <Card>
        <Table head={["Date", "Category", "Shipment", "Customer", "Supplier", "Amount"]}>
          {expenses.map((e: any) => (
            <tr key={e.id} className="hover:bg-slate-50">
              <Td className="text-xs">{fmtDate(e.date)}</Td>
              <Td>{EXPENSE_CATEGORY_LABELS[e.category] ?? e.category}</Td>
              <Td>
                <Link href={`/shipments/${e.shipmentId}`} className="text-xs text-brand hover:underline">
                  {e.shipment.shipmentNumber}
                </Link>
              </Td>
              <Td className="text-xs">{e.shipment.customer.fullName}</Td>
              <Td className="text-xs text-slate-500">{e.supplier ?? "—"}</Td>
              <Td className="tabular-nums font-medium">{fmtMoney(e.amount)}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
