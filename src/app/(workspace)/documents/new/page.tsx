import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { DocumentUploadForm } from "@/components/documents/document-upload-form";

export const metadata = { title: "Upload Document" };

export default async function UploadDocumentPage() {
  const shipments = await prisma.shipment.findMany({
    include: { customer: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Upload Document" subtitle="Register a document against a shipment" />
      <Card>
        <DocumentUploadForm
          shipments={shipments.map((s: any) => ({
            id: s.id,
            label: `${s.shipmentNumber} · ${s.customer.fullName}`,
          }))}
        />
      </Card>
    </div>
  );
}
