"use client";

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { addExpense } from "@/lib/actions/expenses-notes";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS } from "@/lib/constants";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Recording…" : "Record Expense"}</Button>;
}

export function ExpenseRecordForm({
  shipments,
}: {
  shipments: { id: string; label: string }[];
}) {
  const router = useRouter();
  return (
    <form
      action={async (fd) => {
        await addExpense(fd);
        router.refresh();
        router.push("/expenses");
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
        <Field label="Category">
          <Select name="category" defaultValue="OTHER">
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{EXPENSE_CATEGORY_LABELS[c]}</option>
            ))}
          </Select>
        </Field>
        <Field label="Amount (USD)">
          <Input name="amount" type="number" step="0.01" min="0" required placeholder="0.00" />
        </Field>
        <Field label="Supplier">
          <Input name="supplier" placeholder="Supplier / vendor (optional)" />
        </Field>
        <Field label="Date">
          <Input name="date" type="date" />
        </Field>
      </div>
      <div className="mt-6">
        <Submit />
      </div>
    </form>
  );
}
