"use client";

import { createCustomer } from "@/lib/actions/customers";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Creating…" : "Create Customer"}</Button>;
}

export function CustomerForm({
  types,
}: {
  types: readonly string[];
}) {
  return (
    <form action={createCustomer} className="p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Full Name">
          <Input name="fullName" required placeholder="e.g. Tendai Moyo" />
        </Field>
        <Field label="Business Name">
          <Input name="businessName" placeholder="Optional" />
        </Field>
        <Field label="Phone">
          <Input name="phone" required placeholder="+263 …" />
        </Field>
        <Field label="WhatsApp">
          <Input name="whatsapp" placeholder="Optional" />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" placeholder="name@email.com" />
        </Field>
        <Field label="Country">
          <Input name="country" defaultValue="Zimbabwe" />
        </Field>
        <Field label="Customer Type">
          <Select name="customerType" defaultValue="INDIVIDUAL">
            {types.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
            ))}
          </Select>
        </Field>
        <Field label="Address">
          <Input name="address" />
        </Field>
        <Field label="Notes" className="md:col-span-2">
          <Textarea name="notes" />
        </Field>
      </div>
      <div className="mt-6 flex justify-end">
        <Submit />
      </div>
    </form>
  );
}
