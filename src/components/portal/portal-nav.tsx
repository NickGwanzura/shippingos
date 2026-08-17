"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function PortalNav({
  customerName,
  businessName,
}: {
  customerName: string;
  businessName?: string | null;
}) {
  const router = useRouter();
  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/portal/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right leading-tight sm:block">
        <p className="text-sm font-medium text-slate-800">{customerName}</p>
        {businessName && <p className="text-[10px] text-slate-400">{businessName}</p>}
      </div>
      <button
        onClick={handleSignOut}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  );
}
