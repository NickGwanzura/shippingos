import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { fmtMoney } from "@/lib/format";

export function RevenueChart({
  data,
}: {
  data: { key: string; label: string; revenue: number; expenses: number }[];
}) {
  const max = Math.max(...data.map((d) => Math.max(d.revenue, d.expenses, 1)));
  return (
    <Card>
      <CardHeader title="Revenue vs Expenses" subtitle="Last 6 months (confirmed payments)" />
      <CardBody>
        <div className="flex h-48 items-end gap-3">
          {data.map((d) => (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 flex-col justify-end gap-1">
                <div
                  className="w-full rounded-t bg-brand/80"
                  style={{ height: `${(d.revenue / max) * 100}%` }}
                  title={`Revenue ${fmtMoney(d.revenue)}`}
                />
                <div
                  className="w-full rounded-t bg-amber-300"
                  style={{ height: `${(d.expenses / max) * 100}%` }}
                  title={`Expenses ${fmtMoney(d.expenses)}`}
                />
              </div>
              <span className="text-xs text-slate-500">{d.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-brand/80" /> Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-300" /> Expenses
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
