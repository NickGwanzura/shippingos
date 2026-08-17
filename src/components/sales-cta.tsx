"use client";

import { useState } from "react";
import { Rocket, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function SalesCTA({
  whatsappNumber,
}: {
  whatsappNumber: string;
}) {
  const [open, setOpen] = useState(false);
  const digits = whatsappNumber.replace(/[^\d]/g, "");
  const message = encodeURIComponent(
    "Hello! I'd like to request implementation of the Shipping & Logistics Management System.",
  );
  const waHref = `https://wa.me/${digits}?text=${message}`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-700 md:bottom-6 md:right-6"
      >
        <Rocket className="h-4 w-4" />
        Get This System
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Get This System" size="md">
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Shipping & Logistics Management System
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Track every shipment, customer balance, document and profit in one
              place. Replace spreadsheets, WhatsApp groups and paper files.
            </p>
          </div>

          <div className="rounded-xl bg-brand p-5 text-white">
            <p className="text-sm uppercase tracking-wide text-white/70">
              One-off implementation
            </p>
            <p className="mt-1 text-3xl font-bold">$750</p>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {[
                "System Setup",
                "Company Branding",
                "Configuration",
                "User Setup",
                "Initial Training",
                "Customer Portal",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <p className="text-sm font-semibold text-slate-900">
              Hosting, Maintenance & Support
            </p>
            <p className="mt-1 text-xl font-bold text-emerald-600">
              from $37/month
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              href={waHref}
              variant="success"
              size="lg"
              className="w-full"
              icon={<MessageCircle className="h-5 w-5" />}
            >
              Request Implementation
            </Button>
            {whatsappNumber && (
              <p className="text-center text-xs text-slate-400">
                Opens WhatsApp with a pre-filled enquiry
              </p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
