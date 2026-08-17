"use client";

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { recordPayment } from "@/lib/actions/shipments";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { PAYMENT_METHODS } from "@/lib/constants";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Recording…" : "Record Payment"}</Button>;
}

export function PaymentRecordForm({
  shipments,
}: {
  shipments: { id: string; label: string }[];
}) {
  const router = useRouter();
  return (
    <form
      action={async (fd) => {
        await recordPayment(fd);
        router.refresh();
      }}
      className="p-5"
    >
      <div className="max-w-md space-y-4">
        <Field label="Shipment">
          <Select name="shipmentId" required>
            <option value="">Select shipment…</option>
            {shipments.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Amount (USD)">
          <Input name="amount" type="number" step="0.01" min="0" required placeholder="0.00" />
        </Field>
        <Field label="Payment Method">
          <Select name="method" defaultValue="BANK_TRANSFER">
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m.replace(/_/g, " ")}</option>
            ))}
          </Select>
        </Field>
        <Field label="Reference">
          <Input name="reference" placeholder="Transaction reference (optional)" />
        </Field>
      </div>
      <div className="mt-6">
        <Submit />
      </div>
    </form>
  );
}
