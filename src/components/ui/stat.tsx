import { clsx } from "@/lib/format";

export function Stat({
  label,
  value,
  icon,
  sub,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "default" | "green" | "red" | "amber" | "brand";
}) {
  const valueClasses = {
    default: "text-slate-900",
    green: "text-emerald-600",
    red: "text-red-600",
    amber: "text-amber-600",
    brand: "text-brand",
  }[tone];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <p className={clsx("mt-1.5 text-2xl font-semibold tabular-nums", valueClasses)}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
