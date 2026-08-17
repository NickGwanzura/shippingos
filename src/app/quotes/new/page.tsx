import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { QuoteForm } from "@/components/quotes/quote-form";
import { SHIPMENT_TYPES } from "@/lib/constants";

export const metadata = { title: "New Quote" };

export default async function NewQuotePage() {
  const customers = await prisma.customer.findMany({
    orderBy: { fullName: "asc" },
    select: { id: true, fullName: true },
  });
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="New Quote" subtitle="Create a quotation for a customer" />
      <Card>
        <QuoteForm customers={customers} types={SHIPMENT_TYPES} />
      </Card>
    </div>
  );
}
