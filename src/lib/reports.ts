import { prisma } from "@/lib/db";
import { add, dnum } from "@/lib/money";
import type { Prisma } from "@prisma/client";

type RptFilters = {
  type?: string;
  status?: string;
  customerId?: string;
};

export async function getReportsData(filters: RptFilters) {
  const where: Prisma.ShipmentWhereInput = {};
  if (filters.type) where.shipmentType = filters.type;
  if (filters.status) where.status = filters.status;
  if (filters.customerId) where.customerId = filters.customerId;

  const [shipments, payments, expenses, customers] = await Promise.all([
    prisma.shipment.findMany({
      where,
      include: { customer: { select: { fullName: true } } },
    }),
    prisma.payment.findMany({ where: { shipment: where } }),
    prisma.expense.findMany({ where: { shipment: where } }),
    prisma.customer.findMany(),
  ]);

  // Overview
  let revenue = 0, paid = 0, expenseTotal = 0, outstanding = 0;
  for (const s of shipments) {
    revenue = add(revenue, dnum(s.revenue));
    paid = add(paid, dnum(s.amountPaid));
    outstanding = add(outstanding, dnum(s.outstanding));
  }
  for (const e of expenses) expenseTotal = add(expenseTotal, dnum(e.amount));
  const profit = Math.round((revenue - expenseTotal) * 100) / 100;

  // Payments received total (across filtered)
  let paymentsTotal = 0;
  for (const p of payments) paymentsTotal = add(paymentsTotal, dnum(p.amount));

  // Shipment volume by type
  const byType: Record<string, number> = {};
  for (const s of shipments) byType[s.shipmentType] = (byType[s.shipmentType] ?? 0) + 1;

  // Shipment status distribution
  const byStatus: Record<string, number> = {};
  for (const s of shipments) byStatus[s.status] = (byStatus[s.status] ?? 0) + 1;

  // Customer value (top customers by payments)
  const customerValue: Record<string, { name: string; value: number; shipments: number }> = {};
  for (const s of shipments) {
    const c = customerValue[s.customerId] ?? { name: s.customer.fullName, value: 0, shipments: 0 };
    c.value = add(c.value, dnum(s.amountPaid));
    c.shipments += 1;
    customerValue[s.customerId] = c;
  }

  // Delivery performance: on-time rate for delivered
  const delivered = shipments.filter((s) => s.status === "DELIVERED" && s.actualArrival && s.expectedArrival);
  const onTime = delivered.filter((s: any) => {
    const ex = new Date(s.expectedArrival).getTime();
    const ac = new Date(s.actualArrival).getTime();
    return ac <= ex;
  });
  const onTimeRate = delivered.length ? (onTime.length / delivered.length) * 100 : 0;

  return {
    shipmentCount: shipments.length,
    revenue,
    paid,
    outstanding,
    expenseTotal,
    profit,
    profitMargin: revenue > 0 ? (profit / revenue) * 100 : 0,
    paymentsTotal,
    byType,
    byStatus,
    customerValue: Object.entries(customerValue).sort((a, b) => b[1].value - a[1].value).slice(0, 10),
    deliveredCount: delivered.length,
    onTimeCount: onTime.length,
    onTimeRate,
  };
}

export async function getReportOptions() {
  const [types, customers] = await Promise.all([
    prisma.shipment.findMany({ select: { shipmentType: true }, distinct: ["shipmentType"] }),
    prisma.customer.findMany({ select: { id: true, fullName: true }, orderBy: { fullName: "asc" } }),
  ]);
  return { types: types.map((t) => t.shipmentType), customers };
}
