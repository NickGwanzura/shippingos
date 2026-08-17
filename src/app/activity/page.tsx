import Link from "next/link";
import { prisma } from "@/lib/db";
import { timeAgo, fmtDateTime } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Activity Log" };

export default async function ActivityPage() {
  const activity = await prisma.activityLog.findMany({
    include: {
      actor: { select: { name: true } },
      customer: { select: { fullName: true, id: true } },
      shipment: { select: { shipmentNumber: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Activity Log" subtitle="Every action across the business" />
      <Card>
        <ol className="divide-y divide-slate-100">
          {activity.map((a: any) => (
            <li key={a.id} className="flex gap-4 px-5 py-3">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-800">
                  {a.action.replace(/_/g, " ")} — {a.description}
                </p>
                <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-slate-400">
                  <span>{a.actor?.name ?? "System"}</span>
                  {a.customer && (
                    <Link href={`/customers/${a.customer.id}`} className="text-brand hover:underline">
                      {a.customer.fullName}
                    </Link>
                  )}
                  {a.shipment && (
                    <Link href={`/shipments/${a.shipment.id}`} className="text-brand hover:underline">
                      {a.shipment.shipmentNumber}
                    </Link>
                  )}
                  <span title={fmtDateTime(a.createdAt)}>{timeAgo(a.createdAt)}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
