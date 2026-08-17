import Link from "next/link";
import { prisma } from "@/lib/db";
import { add, dnum } from "@/lib/money";
import { fmtMoney, fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Table, Td } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Payments" };

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: {
      customer: { select: { fullName: true } },
      shipment: { select: { shipmentNumber: true } },
    },
    orderBy: { date: "desc" },
  });

  let totalReceived = 0;
  for (const p of payments) totalReceived = add(totalReceived, dnum(p.amount));

  const methodTone: Record<string, "brand" | "green" | "slate" | "amber"> = {
    BANK_TRANSFER: "brand", CASH: "green", ECOCASH: "slate", CARD: "amber", OTHER: "slate",
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Payments"
        subtitle={`${payments.length} payments · ${fmtMoney(totalReceived)} received`}
        actions={<Button href="/payments/new">Record Payment</Button>}
      />

      <Card>
        <Table head={["Receipt", "Date", "Customer", "Shipment", "Amount", "Method", "Reference"]}>
          {payments.map((p: any) => (
            <tr key={p.id} className="hover:bg-slate-50">
              <Td className="font-semibold text-slate-800">{p.receiptNumber ?? "—"}</Td>
              <Td className="text-xs">{fmtDate(p.date)}</Td>
              <Td>{p.customer.fullName}</Td>
              <Td>
                <Link href={`/shipments/${p.shipmentId}`} className="text-xs text-brand hover:underline">
                  {p.shipment.shipmentNumber}
                </Link>
              </Td>
              <Td className="tabular-nums font-medium text-emerald-600">{fmtMoney(p.amount)}</Td>
              <Td><Badge tone={methodTone[p.method] ?? "slate"}>{p.method.replace(/_/g, " ")}</Badge></Td>
              <Td className="text-xs text-slate-400">{p.reference ?? "—"}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
