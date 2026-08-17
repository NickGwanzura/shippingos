"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { recordPayment } from "@/lib/actions/shipments";
import { Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { PAYMENT_METHODS } from "@/lib/constants";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="primary" size="sm" disabled={pending}>{pending ? "Saving…" : "Record Payment"}</Button>;
}

export function RecordPaymentForm({ shipmentId }: { shipmentId: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  return (
    <form
      ref={ref}
      action={async (fd) => {
        await recordPayment(fd);
        ref.current?.reset();
        router.refresh();
      }}
      className="mt-3 space-y-2 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3"
    >
      <p className="text-xs font-semibold text-emerald-800">Record a payment</p>
      <input type="hidden" name="shipmentId" value={shipmentId} />
      <div className="flex flex-wrap gap-2">
        <Input name="amount" type="number" step="0.01" min="0" required placeholder="Amount (USD)" className="w-32" />
        <Select name="method" defaultValue="BANK_TRANSFER" className="w-40">
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>{m.replace(/_/g, " ")}</option>
          ))}
        </Select>
        <Input name="reference" placeholder="Reference" className="w-32" />
        <Submit />
      </div>
    </form>
  );
}
