import { prisma } from "@/lib/db";
import { add, dnum } from "@/lib/money";

/**
 * Portal data for a customer (portal user). IMPORTANT: never expose internal
 * expenses, profit margins, staff data or other customers in these queries.
 */
export async function getPortalData(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      shipments: {
        include: {
          documents: { where: { isDemo: true } },
          supportNotes: { where: { isInternal: false } },
          payments: true,
          invoices: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!customer) return null;

  const c: any = customer;

  let totalOutstanding = 0;
  for (const s of c.shipments) {
    const bal = dnum(s.outstanding);
    if (!["DELIVERED", "CANCELLED"].includes(s.status)) {
      totalOutstanding = add(totalOutstanding, bal);
    }
  }

  const active = c.shipments.filter(
    (s: any) => !["DELIVERED", "CANCELLED"].includes(s.status),
  );
  const delivered = c.shipments.filter(
    (s: any) => s.status === "DELIVERED",
  );

  return { customer: c, active, delivered, totalOutstanding };
}
