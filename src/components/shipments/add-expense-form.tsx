"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { addExpense } from "@/lib/actions/expenses-notes";
import { Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS } from "@/lib/constants";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="sm" variant="outline" disabled={pending}>{pending ? "Saving…" : "Add Expense"}</Button>;
}

export function AddExpenseForm({ shipmentId }: { shipmentId: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  return (
    <form
      ref={ref}
      action={async (fd) => {
        await addExpense(fd);
        ref.current?.reset();
        router.refresh();
      }}
      className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
    >
      <p className="text-xs font-semibold text-slate-600">Add an expense</p>
      <input type="hidden" name="shipmentId" value={shipmentId} />
      <div className="flex flex-wrap gap-2">
        <Select name="category" defaultValue="OTHER" className="w-44">
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{EXPENSE_CATEGORY_LABELS[c]}</option>
          ))}
        </Select>
        <Input name="amount" type="number" step="0.01" min="0" required placeholder="Amount (USD)" className="w-28" />
        <Input name="supplier" placeholder="Supplier" className="w-40" />
        <Input name="date" type="date" className="w-40" />
        <Submit />
      </div>
    </form>
  );
}
