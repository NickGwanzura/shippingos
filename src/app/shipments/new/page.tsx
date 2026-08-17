import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { ShipmentForm } from "@/components/shipments/shipment-form";
import { SHIPMENT_TYPES } from "@/lib/constants";

export const metadata = { title: "New Shipment" };

export default async function NewShipmentPage() {
  const [customers, staff] = await Promise.all([
    prisma.customer.findMany({ orderBy: { fullName: "asc" }, select: { id: true, fullName: true } }),
    prisma.user.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="New Shipment" subtitle="Create a shipment record" />
      <Card>
        <ShipmentForm customers={customers} staff={staff} types={SHIPMENT_TYPES} />
      </Card>
    </div>
  );
}
