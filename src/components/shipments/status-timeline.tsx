"use client";

import { clsx } from "@/lib/format";
import { STATUS_PIPELINE, STATUS_LABELS } from "@/lib/constants";

/**
 * Visual status timeline optimized for phone screens — shows the shipment's
 * position in the pipeline as a horizontal, scrollable rail.
 */
export function StatusTimeline({ status }: { status: string }) {
  const idx = STATUS_PIPELINE.indexOf(status as any);
  const isTerminal = STATUS_PIPELINE.indexOf(status as any) === -1;

  return (
    <div className="no-scrollbar overflow-x-auto pb-2">
      <div className="flex min-w-max items-center gap-1">
        {STATUS_PIPELINE.map((s, i) => {
          const reached = isTerminal ? i < idx : i <= idx;
          const current = s === status;
          return (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center" style={{ width: 76 }}>
                <div
                  className={clsx(
                    "flex h-4 w-4 items-center justify-center rounded-full border-2",
                    current
                      ? "border-brand bg-brand"
                      : reached
                        ? "border-brand bg-brand/15"
                        : "border-slate-300 bg-white",
                  )}
                >
                  {current && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
                <span
                  className={clsx(
                    "mt-1 text-center text-[9px] leading-tight",
                    current
                      ? "font-semibold text-brand"
                      : reached
                        ? "text-slate-600"
                        : "text-slate-400",
                  )}
                >
                  {STATUS_LABELS[s as keyof typeof STATUS_LABELS]}
                </span>
              </div>
              {i < STATUS_PIPELINE.length - 1 && (
                <div
                  className={clsx(
                    "h-0.5 w-6",
                    i < idx ? "bg-brand" : "bg-slate-200",
                  )}
                />
              )}
            </div>
          );
        })}
        {isTerminal && (
          <div className="ml-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            {STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status}
          </div>
        )}
      </div>
    </div>
  );
}
