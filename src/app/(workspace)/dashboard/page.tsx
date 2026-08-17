import {
  Banknote,
  Ship,
  Route,
  Hourglass,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PackageCheck,
  Wallet,
  Users,
} from "lucide-react";
import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";
import { fmtMoney, fmtDateTime, timeAgo } from "@/lib/format";
import { Stat } from "@/components/ui/stat";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/lib/status";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ProfitabilityCard } from "@/components/dashboard/profitability-card";
import { getCompanyConfig } from "@/lib/company";

export const metadata = { title: "Executive Dashboard" };

export default async function DashboardPage() {
  const d = await getDashboardData();
  const config = await getCompanyConfig();
  const cur = config.currency;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Executive Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {config.companyName} · {config.tagline}
          </p>
        </div>
        <div className="flex gap-2">
          <Button href="/shipments/new" variant="secondary" size="sm">
            New Shipment
          </Button>
          <Button href="/reports" variant="outline" size="sm">
            Full Reports
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Stat label="Revenue · This Month" value={fmtMoney(d.revenueThisMonth, cur)} tone="brand" icon={<Banknote className="h-4 w-4" />} />
        <Stat label="Shipments Active" value={d.activeShipments} icon={<Ship className="h-4 w-4" />} sub={`${d.shipmentCount} total`} />
        <Stat label="In Transit" value={d.inTransit} icon={<Route className="h-4 w-4" />} />
        <Stat label="Awaiting Payment" value={d.awaitingPayment} icon={<Hourglass className="h-4 w-4" />} sub={`${fmtMoney(d.expectedCollections, cur)} due this month`} />
        <Stat label="Outstanding Balances" value={fmtMoney(d.outstandingBalances, cur)} tone="amber" icon={<Wallet className="h-4 w-4" />} />
        <Stat label="Expenses · This Month" value={fmtMoney(d.expensesThisMonth, cur)} icon={<TrendingDown className="h-4 w-4" />} />
        <Stat
          label="Gross Profit · This Month"
          value={fmtMoney(d.grossProfit, cur)}
          tone={d.grossProfit >= 0 ? "green" : "red"}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <Stat label="Deliveries · This Week" value={d.deliveriesThisWeek} icon={<PackageCheck className="h-4 w-4" />} sub={`${d.customerCount} customers`} />
      </div>

      {/* Alerts */}
      {(d.overdueCount > 0 || d.updatesRequired > 0) && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {d.overdueCount > 0 && (
            <Link
              href="/invoices"
              className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>
                <span className="font-semibold">{d.overdueCount} overdue invoice{d.overdueCount > 1 ? "s" : ""}</span> —
                total {fmtMoney(d.overdueTotal, cur)}
              </span>
            </Link>
          )}
          {d.updatesRequired > 0 && (
            <Link
              href="/shipments"
              className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
            >
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>
                <span className="font-semibold">{d.updatesRequired} shipment{d.updatesRequired > 1 ? "s" : ""} need attention</span>{" "}
                today
              </span>
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: profitability + chart */}
        <div className="space-y-6 lg:col-span-2">
          <ProfitabilityCard
            revenue={d.totalRevenue}
            expenses={d.totalExpenses}
            profit={d.totalProfit}
            margin={d.totalMargin}
            currency={cur}
        />

          <RevenueChart data={d.revenueByMonth} />

          {/* Shipment status breakdown */}
          <Card>
            <CardHeader
              title="Shipments by Status"
              subtitle="Distribution across the pipeline"
            />
            <CardBody>
              <div className="flex flex-wrap gap-3">
                {Object.entries(d.statusCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"
                    >
                      <StatusBadge status={status} />
                      <span className="text-sm font-semibold text-slate-900">{count}</span>
                    </div>
                  ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right: hero + recent activity */}
        <div className="space-y-6">
          {d.hero && (
            <Card className="border-brand/30 bg-gradient-to-br from-brand to-brand-dark text-white">
              <CardHeader title="Showcase Shipment" subtitle="Your demo hero record" />
              <CardBody className="space-y-3">
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wide">
                    {d.hero.make} {d.hero.model}
                  </p>
                  <Link
                    href={`/shipments/${d.hero.id}`}
                    className="text-xl font-bold hover:underline"
                  >
                    {d.hero.shipmentNumber}
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <span>{d.hero.origin}</span>
                  <span>→</span>
                  <span>{d.hero.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={d.hero.status} />
                  <span className="text-xs text-white/70">
                    {d.hero.make} {d.hero.model}
                  </span>
                </div>
                <div className="mt-2 rounded-lg bg-white/10 p-3 text-sm">
                  <div className="flex justify-between"><span className="text-white/70">Invoice</span><span>{fmtMoney(d.hero.invoiceTotal, cur)}</span></div>
                  <div className="mt-1 flex justify-between"><span className="text-white/70">Paid</span><span>{fmtMoney(d.hero.amountPaid, cur)}</span></div>
                  <div className="mt-1 flex justify-between"><span className="text-white/70">Balance</span><span className="font-semibold text-amber-300">{fmtMoney(d.hero.outstanding, cur)}</span></div>
                </div>
                <Button
                  href={`/shipments/${d.hero.id}`}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  Open Shipment
                </Button>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader title="Recent Activity" subtitle="Latest changes across the business" />
            <CardBody className="p-0">
              <ul className="divide-y divide-slate-100">
                {d.activity.slice(0, 8).map((a) => (
                  <li key={a.id} className="flex gap-3 px-5 py-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-800">{a.description}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {timeAgo(a.createdAt)} · {a.actor?.name ?? "System"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-slate-100 px-5 py-3">
                <Button href="/activity" variant="ghost" size="sm">
                  View full activity log
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
