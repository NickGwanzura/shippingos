"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/field";

export function CustomerSearch({ query }: { query: string }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        defaultValue={query}
        placeholder="Search customers…"
        className="pl-9"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const v = (e.target as HTMLInputElement).value.trim();
            router.push(v ? `${pathname}?q=${encodeURIComponent(v)}` : pathname);
          }
        }}
      />
    </div>
  );
}
