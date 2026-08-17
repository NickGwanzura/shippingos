import Link from "next/link";
import { prisma } from "@/lib/db";
import { add, dnum } from "@/lib/money";
import { fmtMoney } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Table, Td } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomerSearch } from "@/components/customers/customer-search";
import { Users } from "lucide-react";

export const metadata = { title: "Customers" };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const sp = await Promise.resolve(searchParams);
  const q = sp.q?.trim();
  const where = q
    ? {
        OR: [
          { fullName: { contains: q, mode: "insensitive" as const } },
          { businessName: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { phone: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const customers = await prisma.customer.findMany({
    where,
    include: {
      shipments: { select: { id: true, invoiceTotal: true, amountPaid: true, status: true } },
      invoices: { select: { balance: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const rows = customers.map((c: any) => {
    const shipmentCount = c.shipments.length;
    let lifetime = 0;
    for (const s of c.shipments) lifetime = add(lifetime, dnum(s.amountPaid));
    let outstanding = 0;
    for (const i of c.invoices) outstanding = add(outstanding, dnum(i.balance));
    return { c, shipmentCount, lifetime, outstanding };
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customer${customers.length === 1 ? "" : "s"}`}
        actions={<Button href="/customers/new">New Customer</Button>}
      />

      <div className="mb-4 max-w-sm">
        <CustomerSearch query={q ?? ""} />
      </div>

      <Card>
        <Table head={["Customer", "Type", "Shipments", "Lifetime Value", "Outstanding", "Portal"]}>
          {rows.map(({ c, shipmentCount, lifetime, outstanding }: any) => (
            <tr key={c.id} className="hover:bg-slate-50">
              <Td>
                <Link href={`/customers/${c.id}`} className="font-semibold text-brand hover:underline">
                  {c.fullName}
                </Link>
                {c.businessName && (
                  <p className="text-xs text-slate-400">{c.businessName}</p>
                )}
                <p className="text-xs text-slate-400">{c.phone}</p>
              </Td>
              <Td>
                <Badge tone={c.customerType === "BUSINESS" ? "brand" : "slate"}>
                  {c.customerType.replace(/_/g, " ")}
                </Badge>
              </Td>
              <Td>{shipmentCount}</Td>
              <Td className="tabular-nums font-medium">{fmtMoney(lifetime)}</Td>
              <Td className={`tabular-nums font-medium ${outstanding > 0 ? "text-amber-600" : "text-slate-400"}`}>
                {fmtMoney(outstanding)}
              </Td>
              <Td>{c.portalEnabled ? <Badge tone="green">Enabled</Badge> : <span className="text-xs text-slate-300">—</span>}</Td>
            </tr>
          ))}
        </Table>
        {customers.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Users className="h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">No customers found.</p>
            <Button href="/customers/new">New Customer</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
