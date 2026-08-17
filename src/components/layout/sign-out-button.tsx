"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOutButton({
  className,
  label = "Sign out",
}: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  async function handle() {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  }
  return (
    <button
      onClick={handle}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      }
    >
      <LogOut className="h-4 w-4" />
      {label}
    </button>
  );
}
