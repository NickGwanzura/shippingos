"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  UserPlus,
  FileText,
  Ship,
  Wallet,
  ReceiptText,
  FolderUp,
  X,
} from "lucide-react";

const ACTIONS = [
  { href: "/customers/new", label: "New Customer", icon: UserPlus },
  { href: "/quotes/new", label: "New Quote", icon: FileText },
  { href: "/shipments/new", label: "New Shipment", icon: Ship },
  { href: "/payments/new", label: "Record Payment", icon: Wallet },
  { href: "/expenses/new", label: "Record Expense", icon: ReceiptText },
  { href: "/documents/new", label: "Upload Document", icon: FolderUp },
];

export function QuickActions() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className="fixed bottom-40 right-4 z-50 flex flex-col items-end gap-2 md:hidden">
        {open &&
          ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-lg ring-1 ring-slate-200"
            >
              <a.icon className="h-4 w-4 text-brand" />
              {a.label}
            </Link>
          ))}
      </div>

      {/* Desktop: small, unobtrusive quick button */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:block">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
          aria-label="Quick actions"
        >
          {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </button>
        {open && (
          <div className="absolute bottom-16 left-0 w-52 space-y-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
            {ACTIONS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <a.icon className="h-4 w-4 text-brand" />
                {a.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
