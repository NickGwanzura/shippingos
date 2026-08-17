import { fmtMoney } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { ReportsFilters } from "@/components/reports/reports-filters";
import { getReportsData, getReportOptions } from "@/lib/reports";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { STATUS_LABELS } from "@/lib/constants";

export const metadata = { title: "Reports" };

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { type?: string; status?: string; customer?: string };
}) {
  const sp = await Promise.resolve(searchParams);
  const filters = {
    type: sp.type && sp.type !== "ALL" ? sp.type : undefined,
    status: sp.status && sp.status !== "ALL" ? sp.status : undefined,
    customerId: sp.customer && sp.customer !== "ALL" ? sp.customer : undefined,
  };
  const [data, options] = await Promise.all([getReportsData(filters), getReportOptions()]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Reports" subtitle="Business performance and analysis" />

      <ReportsFilters
        types={options.types}
        customers={options.customers}
        activeType={sp.type ?? "ALL"}
        activeStatus={sp.status ?? "ALL"}
        activeCustomer={sp.customer ?? "ALL"}
      />

      {/* Overview */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Shipments" value={data.shipmentCount} />
        <Stat label="Revenue" value={fmtMoney(data.revenue)} tone="brand" />
        <Stat label="Expenses" value={fmtMoney(data.expenseTotal)} />
        <Stat label="Gross Profit" value={fmtMoney(data.profit)} tone={data.profit >= 0 ? "green" : "red"} />
        <Stat label="Margin" value={`${data.profitMargin.toFixed(1)}%`} tone="brand" />
        <Stat label="Outstanding" value={fmtMoney(data.outstanding)} tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Shipment volume by type */}
        <Card>
          <CardHeader title="Shipment Volume by Type" />
          <CardBody className="space-y-2">
            {Object.entries(data.byType).map(([type, count]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="text-slate-600">{type}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
            {Object.keys(data.byType).length === 0 && <p className="text-sm text-slate-400">No data.</p>}
          </CardBody>
        </Card>

        {/* Status distribution */}
        <Card>
          <CardHeader title="Shipment Status" />
          <CardBody className="space-y-2">
            {Object.entries(data.byStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between text-sm">
                <span className="text-slate-600">{STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
            {Object.keys(data.byStatus).length === 0 && <p className="text-sm text-slate-400">No data.</p>}
          </CardBody>
        </Card>

        {/* Delivery performance */}
        <Card>
          <CardHeader title="Delivery Performance" />
          <CardBody className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-600">Delivered</span><span className="font-semibold">{data.deliveredCount}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">On-time</span><span className="font-semibold text-emerald-600">{data.onTimeCount}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">On-time rate</span><span className="font-semibold">{data.onTimeRate.toFixed(0)}%</span></div>
          </CardBody>
        </Card>
      </div>

      {/* Customer value */}
      <Card>
        <CardHeader title="Customer Value" subtitle="Ranked by amount received" />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Shipments</th>
                  <th className="px-5 py-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.customerValue.map(([id, c]) => (
                  <tr key={id}>
                    <td className="px-5 py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="px-5 py-3 text-slate-600">{c.shipments}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-medium">{fmtMoney(c.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
