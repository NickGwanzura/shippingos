"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Ship,
  Receipt,
  Wallet,
  ReceiptText,
  FolderOpen,
  BarChart3,
  Search,
  Activity,
  Anchor,
} from "lucide-react";
import { clsx } from "@/lib/format";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/quotes", label: "Quotes", icon: FileText },
  { href: "/shipments", label: "Shipments", icon: Ship },
  { href: "/invoices", label: "Invoices", icon: Receipt },
  { href: "/payments", label: "Payments", icon: Wallet },
  { href: "/expenses", label: "Expenses", icon: ReceiptText },
  { href: "/documents", label: "Documents", icon: FolderOpen },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function Sidebar({ userName }: { userName: string }) {
  return (
    <aside className="sticky top-0 h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white hidden md:flex">
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
          <Anchor className="h-4 w-4 text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-slate-900">Horizon Freight</p>
          <p className="text-[11px] text-slate-500">Moving Business Forward</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
        <div className="pt-2">
          <NavLink href="/search" label="Search" icon={Search} />
          <NavLink href="/activity" label="Activity" icon={Activity} />
        </div>
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light text-xs font-bold text-brand">
            {userName.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">{userName}</p>
            <p className="text-[11px] text-slate-400">Operations</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-brand-light text-brand"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
