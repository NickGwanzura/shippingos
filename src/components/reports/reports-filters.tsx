"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/field";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/constants";

export function ReportsFilters({
  types,
  customers,
  activeType,
  activeStatus,
  activeCustomer,
}: {
  types: string[];
  customers: { id: string; fullName: string }[];
  activeType: string;
  activeStatus: string;
  activeCustomer: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function apply(key: string, val: string) {
    const params = new URLSearchParams(sp.toString());
    if (!val || val === "ALL") params.delete(key);
    else params.set(key, val);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Select value={activeType} onChange={(e) => apply("type", e.target.value)} className="sm:w-56">
        <option value="ALL">All types</option>
        {types.map((t) => <option key={t} value={t}>{t}</option>)}
      </Select>
      <Select value={activeStatus} onChange={(e) => apply("status", e.target.value)} className="sm:w-52">
        <option value="ALL">All statuses</option>
        {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
      </Select>
      <Select value={activeCustomer} onChange={(e) => apply("customer", e.target.value)} className="sm:w-64">
        <option value="ALL">All customers</option>
        {customers.map((c) => <option key={c.id} value={c.id}>{c.fullName}</option>)}
      </Select>
    </div>
  );
}
