import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { ExpenseRecordForm } from "@/components/expenses/expense-record-form";

export const metadata = { title: "Record Expense" };

export default async function RecordExpensePage() {
  const shipments = await prisma.shipment.findMany({
    include: { customer: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Record Expense" subtitle="Add an expense against a shipment" />
      <Card>
        <ExpenseRecordForm
          shipments={shipments.map((s: any) => ({
            id: s.id,
            label: `${s.shipmentNumber} · ${s.customer.fullName}`,
          }))}
        />
      </Card>
    </div>
  );
}
