import Link from "next/link";
import { Anchor } from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";

export function TopBar({
  userName,
  roleLabel,
}: {
  userName: string;
  roleLabel: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:hidden">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
          <Anchor className="h-4 w-4 text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-slate-900">Horizon Freight</p>
          <p className="text-[10px] text-slate-400">Moving Business Forward</p>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <div className="text-right leading-tight">
          <p className="text-xs font-medium text-slate-800">{userName}</p>
          <p className="text-[10px] text-slate-400">{roleLabel}</p>
        </div>
        <SignOutButton className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600" />
      </div>
    </header>
  );
}
