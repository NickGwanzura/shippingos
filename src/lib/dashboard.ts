import { prisma } from "@/lib/db";
import { add, subtract, cents } from "@/lib/money";

/** Aggregated KPIs and data for the executive dashboard. */
export async function getDashboardData() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date(now);
  const day = (now.getDay() + 6) % 7; // Monday=0
  weekStart.setDate(now.getDate() - day);
  weekStart.setHours(0, 0, 0, 0);

  const [shipments, invoices, payments, expenses, customers, activity, monthPayments, monthExpenses] =
    await Promise.all([
      prisma.shipment.findMany(),
      prisma.invoice.findMany(),
      prisma.payment.findMany(),
      prisma.expense.findMany(),
      prisma.customer.findMany({ include: { shipments: true } }),
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { name: true } }, customer: { select: { fullName: true } } },
        take: 12,
      }),
      prisma.payment.findMany({ where: { date: { gte: monthStart } } }),
      prisma.expense.findMany({ where: { date: { gte: monthStart } } }),
    ]);

  // ---- KPI rollups (decimal-safe) ----
  let revenueThisMonth = 0;
  for (const p of monthPayments) revenueThisMonth = add(revenueThisMonth, p.amount);

  let expensesThisMonth = 0;
  for (const e of monthExpenses) expensesThisMonth = add(expensesThisMonth, e.amount);

  const grossProfit = subtract(revenueThisMonth, expensesThisMonth);

  // Outstanding customer balances = sum of invoice balances
  let outstandingBalances = 0;
  for (const inv of invoices) outstandingBalances = add(outstandingBalances, inv.balance);

  // Expected collections this month = invoices due this month not yet fully paid
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  let expectedCollections = 0;
  for (const inv of invoices) {
    if (inv.dueDate >= monthStart && inv.dueDate <= now) {
      expectedCollections = add(expectedCollections, inv.balance);
    }
  }

  // Overdue invoices
  const overdueInvoices = invoices.filter(
    (i) =>
      i.status !== "PAID" &&
      i.balance.gt(0) &&
      i.dueDate < now,
  );
  let overdueTotal = 0;
  for (const inv of overdueInvoices) overdueTotal = add(overdueTotal, inv.balance);

  // Shipment counts
  const activeShipments = shipments.filter(
    (s) => s.status !== "DELIVERED" && s.status !== "CANCELLED",
  ).length;
  const inTransit = shipments.filter((s) =>
    ["DEPARTED", "IN_TRANSIT", "ARRIVED_AT_PORT"].includes(s.status),
  ).length;
  const awaitingPayment = shipments.filter(
    (s) => s.paymentStatus === "UNPAID" || s.paymentStatus === "PARTIALLY_PAID",
  ).length;

  const deliveriesThisWeek = shipments.filter(
    (s) => s.status === "DELIVERED" && s.actualArrival && s.actualArrival >= weekStart,
  ).length;

  // Customer updates required: shipments with recent internal notes needing action
  const updatesRequired = shipments.filter(
    (s) =>
      ["IN_TRANSIT", "ARRIVED_AT_PORT", "CUSTOMS_PROCESSING", "AT_WAREHOUSE"].includes(
        s.status,
      ) && s.paymentStatus !== "PAID",
  ).length;

  // ---- Shipment profitability (top-level aggregate) ----
  let totalRevenue = 0;
  let totalExpenses = 0;
  let totalProfit = 0;
  for (const s of shipments) {
    totalRevenue = add(totalRevenue, s.revenue);
    totalExpenses = add(totalExpenses, s.expensesTotal);
    totalProfit = add(totalProfit, s.profit);
  }
  const totalMargin = totalRevenue <= 0 ? 0 : (totalProfit / totalRevenue) * 100;

  // ---- Shipments by status (for chart) ----
  const statusCounts: Record<string, number> = {};
  for (const s of shipments) statusCounts[s.status] = (statusCounts[s.status] ?? 0) + 1;

  // ---- Revenue by month for chart (last 6 months) ----
  const revenueByMonth: { key: string; label: string; revenue: number; expenses: number }[] = [];
  for (let m = 5; m >= 0; m--) {
    const start = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - m + 1, 1);
    let rev = 0;
    let exp = 0;
    for (const p of payments) {
      if (p.date >= start && p.date < end) rev = add(rev, p.amount);
    }
    for (const e of expenses) {
      if (e.date >= start && e.date < end) exp = add(exp, e.amount);
    }
    revenueByMonth.push({
      key: start.toISOString().slice(0, 7),
      label: start.toLocaleString("en", { month: "short" }),
      revenue: rev,
      expenses: exp,
    });
  }

  // ---- Hero profitability record ----
  const hero = shipments.find((s) => s.shipmentNumber === "SHIP-2026-1001");

  return {
    revenueThisMonth,
    expensesThisMonth,
    grossProfit,
    outstandingBalances,
    expectedCollections,
    overdueCount: overdueInvoices.length,
    overdueTotal,
    activeShipments,
    inTransit,
    awaitingPayment,
    deliveriesThisWeek,
    updatesRequired,
    totalRevenue,
    totalExpenses,
    totalProfit,
    totalMargin,
    shipmentCount: shipments.length,
    customerCount: customers.length,
    statusCounts,
    revenueByMonth,
    activity,
    hero,
  };
}
