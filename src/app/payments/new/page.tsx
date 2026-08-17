import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { PaymentRecordForm } from "@/components/payments/payment-record-form";

export const metadata = { title: "Record Payment" };

export default async function RecordPaymentPage() {
  const shipments = await prisma.shipment.findMany({
    where: { paymentStatus: { in: ["UNPAID", "PARTIALLY_PAID"] } },
    include: { customer: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Record Payment" subtitle="Record a payment against a shipment" />
      <Card>
        <PaymentRecordForm shipments={shipments.map((s: any) => ({
          id: s.id,
          label: `${s.shipmentNumber} · ${s.customer.fullName}`,
        }))} />
      </Card>
    </div>
  );
}
