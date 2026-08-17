"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

/** Admin-only demo reset button. Restores the original seeded demo data. */
export function DemoResetButton() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const router = useRouter();

  async function run() {
    setState("running");
    try {
      const res = await fetch("/api/demo/reset", { method: "POST" });
      if (!res.ok) throw new Error("failed");
      setState("done");
      setTimeout(() => {
        setOpen(false);
        setState("idle");
        router.refresh();
        router.push("/dashboard");
      }, 900);
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={() => setOpen(true)}>
        Reset Demo Data
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Reset Demo Data" size="sm">
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              This removes any temporary demo records you created and restores the
              original seeded demo data.
            </p>
          </div>
          {state === "done" && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
              <Check className="h-4 w-4" /> Demo data restored.
            </div>
          )}
          {state === "error" && (
            <p className="text-sm text-red-600">Reset failed. Please try again.</p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={state === "running"}>
              Cancel
            </Button>
            <Button variant="danger" onClick={run} disabled={state === "running"}>
              {state === "running" ? "Resetting…" : "Confirm Reset"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
