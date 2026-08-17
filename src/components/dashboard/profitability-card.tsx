import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { fmtMoney } from "@/lib/format";

/**
 * Shipment Profitability card — the flagship sales feature.
 * Shows Revenue, Expenses, Gross Profit and Profit Margin.
 */
export function ProfitabilityCard({
  revenue,
  expenses,
  profit,
  margin,
  currency,
}: {
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  currency: string;
}) {
  const positive = profit >= 0;
  const max = Math.max(revenue, 1);
  const revenueBar = (revenue / max) * 100;
  const expenseBar = (expenses / max) * 100;

  return (
    <Card>
      <CardHeader
        title="Shipment Profitability"
        subtitle="Revenue vs expenses across all shipments"
        action={
          <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            Margin {fmtMoney(margin)}%
          </span>
        }
      />
      <CardBody className="space-y-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">Revenue</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
              {fmtMoney(revenue, currency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Expenses</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
              {fmtMoney(expenses, currency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Gross Profit</p>
            <p
              className={`mt-1 text-2xl font-semibold tabular-nums ${
                positive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {fmtMoney(profit, currency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Profit Margin</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-brand">
              {margin.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Bar visualization */}
        <div className="space-y-2">
          <div>
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Revenue</span>
              <span>{revenueBar.toFixed(0)}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${revenueBar}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Expenses</span>
              <span>{expenseBar.toFixed(0)}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${expenseBar}%` }}
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
