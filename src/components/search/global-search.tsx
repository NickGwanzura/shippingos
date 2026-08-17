"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/field";

export function GlobalSearch({ query }: { query: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(query);

  function submit() {
    const v = value.trim();
    router.push(v ? `${pathname}?q=${encodeURIComponent(v)}` : pathname);
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Search customer, shipment, invoice, vehicle, VIN, container…"
        className="h-12 pl-11 text-base"
      />
    </div>
  );
}
