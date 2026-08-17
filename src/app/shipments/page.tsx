import Link from "next/link";
import { prisma } from "@/lib/db";
import { fmtMoney, fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Table, Td } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { StatusBadge, PaymentStatusBadge } from "@/lib/status";
import { STATUS_LABELS } from "@/lib/constants";
import { ShipmentsFilter } from "@/components/shipments/shipments-filter";
import { EmptyState } from "@/components/ui/empty-state";
import { Ship } from "lucide-react";

export const metadata = { title: "Shipments" };

export default async function ShipmentsPage({
  searchParams,
}: {
  searchParams: { status?: string; type?: string; q?: string };
}) {
  const sp = await Promise.resolve(searchParams);
  const where: any = {};
  if (sp.status && sp.status !== "ALL") where.status = sp.status;
  if (sp.type && sp.type !== "ALL") where.shipmentType = sp.type;
  if (sp.q) {
    const q = sp.q.trim();
    where.OR = [
      { shipmentNumber: { contains: q, mode: "insensitive" } },
      { trackingReference: { contains: q, mode: "insensitive" } },
      { containerNumber: { contains: q, mode: "insensitive" } },
      { vehicleRegistration: { contains: q, mode: "insensitive" } },
      { customer: { fullName: { contains: q, mode: "insensitive" } } },
    ];
  }

  const [shipments, types] = await Promise.all([
    prisma.shipment.findMany({
      where,
      include: { customer: { select: { fullName: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.shipment.findMany({ select: { shipmentType: true }, distinct: ["shipmentType"] }),
  ]);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Shipments"
        subtitle={`${shipments.length} shipment${shipments.length === 1 ? "" : "s"}`}
        actions={<Button href="/shipments/new">New Shipment</Button>}
      />

      <ShipmentsFilter
        types={types.map((t) => t.shipmentType)}
        activeStatus={sp.status ?? "ALL"}
        activeType={sp.type ?? "ALL"}
        query={sp.q ?? ""}
      />

      <Card>
        <Table
          head={["Shipment", "Customer", "Type", "Route", "Status", "Payment", "Total"]}
        >
          {shipments.map((s: any) => (
            <tr key={s.id} className="hover:bg-slate-50">
              <Td>
                <Link
                  href={`/shipments/${s.id}`}
                  className="font-semibold text-brand hover:underline"
                >
                  {s.shipmentNumber}
                </Link>
                {s.make && (
                  <p className="text-xs text-slate-400">
                    {s.make} {s.model ?? ""}
                  </p>
                )}
              </Td>
              <Td className="font-medium">{s.customer.fullName}</Td>
              <Td>{s.shipmentType}</Td>
              <Td className="max-w-[180px] truncate">
                <span className="text-xs">{s.origin}</span>
                <span className="mx-1 text-slate-300">→</span>
                <span className="text-xs">{s.destination}</span>
                <p className="text-[11px] text-slate-400">
                  ETA {fmtDate(s.expectedArrival)}
                </p>
              </Td>
              <Td><StatusBadge status={s.status} /></Td>
              <Td><PaymentStatusBadge status={s.paymentStatus} /></Td>
              <Td className="tabular-nums font-medium">
                {fmtMoney(s.invoiceTotal)}
              </Td>
            </tr>
          ))}
        </Table>
        {shipments.length === 0 && (
          <EmptyState
            icon={<Ship className="h-6 w-6" />}
            title="No shipments found"
            description="Adjust your filters or create a new shipment."
            action={<Button href="/shipments/new">New Shipment</Button>}
          />
        )}
      </Card>
    </div>
  );
}
