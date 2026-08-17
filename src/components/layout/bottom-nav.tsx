"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Ship, Wallet, BarChart3 } from "lucide-react";
import { clsx } from "@/lib/format";

const ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/shipments", label: "Shipments", icon: Ship },
  { href: "/payments", label: "Payments", icon: Wallet },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div className="flex items-stretch justify-around">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex min-w-[64px] flex-1 flex-col items-center gap-1 py-2.5",
                active ? "text-brand" : "text-slate-400",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
