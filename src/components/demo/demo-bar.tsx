import { Info } from "lucide-react";
import { StartDemoButton } from "@/components/demo/demo-tour";
import { DemoResetButton } from "@/components/demo/demo-reset-button";

/**
 * Persistent Demo Mode bar (in-flow, sits at the very top of the app shell).
 * Shows the guided "Start Demo" tour button + (for super admins) demo reset.
 */
export function DemoBar({ isSuperAdmin }: { isSuperAdmin?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-b border-amber-300 bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-amber-950">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold sm:text-sm">
        <Info className="h-4 w-4 shrink-0" />
        DEMO MODE — Sales Demonstration Environment
      </span>
      <span className="mx-1 hidden h-4 w-px bg-amber-700/30 sm:block" />
      <div className="flex items-center gap-2">
        <StartDemoButton />
        {isSuperAdmin && <DemoResetButton />}
      </div>
    </div>
  );
}
