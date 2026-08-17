"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Select, Input } from "@/components/ui/field";
import { STATUS_LABELS, ALL_STATUSES } from "@/lib/constants";

export function ShipmentsFilter({
  types,
  activeStatus,
  activeType,
  query,
}: {
  types: string[];
  activeStatus: string;
  activeType: string;
  query: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function apply(next: Record<string, string>) {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v || v === "ALL") params.delete(k);
      else params.set(k, v);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search shipment, container, vehicle…"
          defaultValue={query}
          className="pl-9"
          onKeyDown={(e) => {
            if (e.key === "Enter") apply({ q: (e.target as HTMLInputElement).value });
          }}
        />
      </div>
      <Select
        value={activeStatus}
        onChange={(e) => apply({ status: e.target.value })}
        className="sm:w-48"
      >
        <option value="ALL">All statuses</option>
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </Select>
      <Select
        value={activeType}
        onChange={(e) => apply({ type: e.target.value })}
        className="sm:w-52"
      >
        <option value="ALL">All types</option>
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Select>
    </div>
  );
}
