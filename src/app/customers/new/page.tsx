import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { CustomerForm } from "@/components/customers/customer-form";
import { CUSTOMER_TYPES } from "@/lib/constants";

export const metadata = { title: "New Customer" };

export default async function NewCustomerPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New Customer" subtitle="Add a customer record" />
      <Card>
        <CustomerForm types={CUSTOMER_TYPES} />
      </Card>
    </div>
  );
}
