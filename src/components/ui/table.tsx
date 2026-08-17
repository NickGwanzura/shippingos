import { clsx } from "@/lib/format";

export function Table({
  head,
  children,
  className,
}: {
  head: React.ReactNode[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            {head.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <td className={clsx("px-4 py-3 align-middle text-slate-700", className)}>{children}</td>;
}

export function Th({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <th className={clsx("px-4 py-3", className)}>{children}</th>;
}
