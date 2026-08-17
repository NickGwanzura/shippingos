"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, Ship, Wallet,
  ReceiptText, TrendingUp, PackageSearch, BarChart3,
  Play, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: LayoutDashboard,
    title: "Executive Dashboard",
    href: "/dashboard",
    text: "At a glance: revenue, shipments in transit, outstanding balances, expenses and gross profit. Every shipment, every dollar, one screen.",
  },
  {
    icon: Users,
    title: "Customer",
    href: "/customers",
    text: "Every customer record with shipment history, lifetime value and outstanding balance.",
  },
  {
    icon: FileText,
    title: "Quote",
    href: "/quotes",
    text: "Generate a professional quotation in seconds. Convert it straight into a shipment.",
  },
  {
    icon: Ship,
    title: "Shipment",
    href: "/shipments",
    text: "Track every shipment through a visual status pipeline — from enquiry to delivery.",
  },
  {
    icon: Wallet,
    title: "Payment",
    href: "/payments",
    text: "Record cash, transfers or EcoCash. Balances update instantly and a receipt is generated.",
  },
  {
    icon: ReceiptText,
    title: "Expenses",
    href: "/expenses",
    text: "Link every expense to a shipment — freight, customs, clearing, transport and more.",
  },
  {
    icon: TrendingUp,
    title: "Profit",
    href: "/dashboard",
    text: "See exactly what each shipment is worth. Revenue minus expenses equals profit, deterministically.",
  },
  {
    icon: PackageSearch,
    title: "Customer Portal",
    href: "/login",
    text: "Your customer logs in and follows their shipment, balance and documents — never your internal numbers.",
  },
  {
    icon: BarChart3,
    title: "Reports",
    href: "/reports",
    text: "Revenue, expenses, profitability, customer value and delivery performance in one place.",
  },
];

export function StartDemoButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  function go(path: string) {
    router.push(path);
  }

  function close() {
    setOpen(false);
    setStep(0);
  }

  return (
    <>
      <Button
        variant="success"
        icon={<Play className="h-4 w-4" />}
        onClick={() => setOpen(true)}
      >
        Start Demo
      </Button>

      <Modal open={open} onClose={close} title="Guided Demo Tour" size="md">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light">
            <s.icon className="h-8 w-8 text-brand" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand">
              Step {step + 1} of {STEPS.length}
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">{s.title}</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">{s.text}</p>
          </div>

          {/* step dots */}
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? "w-5 bg-brand" : "w-1.5 bg-slate-200"}`}
              />
            ))}
          </div>

          <div className="flex w-full items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft className="h-4 w-4" />}
              disabled={step === 0}
              onClick={() => setStep((v) => Math.max(0, v - 1))}
            >
              Back
            </Button>
            <div className="flex gap-2">
              {step < STEPS.length - 1 ? (
                <>
                  <Button variant="outline" size="sm" onClick={close}>Skip</Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      go(s.href);
                      setStep((v) => v + 1);
                    }}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button variant="success" size="sm" onClick={close}>
                  Done
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
