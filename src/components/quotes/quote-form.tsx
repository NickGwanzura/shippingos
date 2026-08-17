"use client";

import { useMemo, useState } from "react";
import { createQuote } from "@/lib/actions/quotes";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

function n(v: string): number {
  return v === "" ? 0 : parseFloat(v) || 0;
}

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Creating…" : "Create Quote"}</Button>;
}

export function QuoteForm({
  customers,
  types,
}: {
  customers: { id: string; fullName: string }[];
  types: readonly string[];
}) {
  const [f, setF] = useState<Record<string, string>>({});
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));
  const [deposit, setDeposit] = useState("");

  const total = useMemo(() => {
    return (
      n(f.freight || "0") + n(f.collection || "0") + n(f.clearing || "0") +
      n(f.insurance || "0") + n(f.delivery || "0") + n(f.storage || "0") +
      n(f.other || "0") - n(f.discount || "0")
    );
  }, [f]);

  return (
    <form action={createQuote} className="p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Customer" className="md:col-span-3">
          <Select name="customerId" required>
            <option value="">Select customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.fullName}</option>
            ))}
          </Select>
        </Field>
        <Field label="Shipment Type">
          <Select name="shipmentType" defaultValue="General Cargo">
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="Origin">
          <Input name="origin" placeholder="e.g. Birmingham, UK" />
        </Field>
        <Field label="Destination">
          <Input name="destination" placeholder="e.g. Harare, Zimbabwe" />
        </Field>
        <Field label="Cargo Description" className="md:col-span-3">
          <Textarea name="cargoDescription" placeholder="Describe the cargo / vehicle…" />
        </Field>

        <Field label="Freight Charge ($)"><Input name="freightCharge" type="number" step="0.01" onChange={set("freight")} /></Field>
        <Field label="Collection Fee ($)"><Input name="collectionFee" type="number" step="0.01" onChange={set("collection")} /></Field>
        <Field label="Clearing Fee ($)"><Input name="clearingFee" type="number" step="0.01" onChange={set("clearing")} /></Field>
        <Field label="Insurance ($)"><Input name="insurance" type="number" step="0.01" onChange={set("insurance")} /></Field>
        <Field label="Delivery Fee ($)"><Input name="deliveryFee" type="number" step="0.01" onChange={set("delivery")} /></Field>
        <Field label="Storage ($)"><Input name="storage" type="number" step="0.01" onChange={set("storage")} /></Field>
        <Field label="Other Charges ($)"><Input name="otherCharges" type="number" step="0.01" onChange={set("other")} /></Field>
        <Field label="Discount ($)"><Input name="discount" type="number" step="0.01" onChange={set("discount")} /></Field>
        <Field label="Deposit Required ($)"><Input name="depositRequired" type="number" step="0.01" value={deposit} onChange={(e) => setDeposit(e.target.value)} /></Field>
        <Field label="Expiry Date"><Input name="expiryDate" type="date" /></Field>

        <div className="rounded-lg border border-brand-light bg-brand-light/40 p-3 md:col-span-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Quote Total (auto-calculated)</span>
            <span className="text-lg font-bold tabular-nums text-brand">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Submit />
      </div>
    </form>
  );
}
