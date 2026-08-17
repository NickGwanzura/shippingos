import Link from "next/link";
import { prisma } from "@/lib/db";
import { fmtDate, timeAgo } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Table, Td } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Documents" };

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    include: {
      shipment: { select: { shipmentNumber: true, id: true } },
      customer: { select: { fullName: true } },
      uploadedBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const tone = (t: string) =>
    ["BILL_OF_LADING", "CUSTOMS_DOCUMENTS", "EXPORT_DOCUMENTS"].includes(t) ? "brand" : "slate";

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Documents"
        subtitle={`${documents.length} document${documents.length === 1 ? "" : "s"}`}
        actions={<Button href="/documents/new">Upload Document</Button>}
      />

      <Card>
        <Table head={["File", "Type", "Shipment", "Customer", "Uploaded By", "Date"]}>
          {documents.map((d: any) => (
            <tr key={d.id} className="hover:bg-slate-50">
              <Td className="font-medium text-slate-800">{d.fileName}</Td>
              <Td><Badge tone={tone(d.type) as any}>{d.type.replace(/_/g, " ")}</Badge></Td>
              <Td>
                {d.shipment ? (
                  <Link href={`/shipments/${d.shipment.id}`} className="text-xs text-brand hover:underline">
                    {d.shipment.shipmentNumber}
                  </Link>
                ) : "—"}
              </Td>
              <Td className="text-xs">{d.customer?.fullName ?? "—"}</Td>
              <Td className="text-xs text-slate-500">{d.uploadedBy?.name ?? "—"}</Td>
              <Td className="text-xs text-slate-400">{timeAgo(d.createdAt)}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
