"use client";

import { useFormStatus } from "react-dom";
import { createShipment } from "@/lib/actions/shipments";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating…" : "Create Shipment"}
    </Button>
  );
}

export function ShipmentForm({
  customers,
  staff,
  types,
}: {
  customers: { id: string; fullName: string }[];
  staff: { id: string; name: string }[];
  types: readonly string[];
}) {
  return (
    <form action={createShipment} className="p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Customer" className="md:col-span-3">
          <Select name="customerId" required>
            <option value="">Select customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Shipment Type">
          <Select name="shipmentType" defaultValue="General Cargo">
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Assigned Staff">
          <Select name="assignedStaffId" defaultValue="">
            <option value="">Unassigned</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Invoice Total (USD)">
          <Input name="invoiceTotal" type="number" step="0.01" min="0" placeholder="0.00" />
        </Field>

        <Field label="Origin">
          <Input name="origin" placeholder="e.g. Birmingham, UK" />
        </Field>
        <Field label="Destination">
          <Input name="destination" placeholder="e.g. Harare, Zimbabwe" />
        </Field>
        <Field label="Departure Date">
          <Input name="departureDate" type="date" />
        </Field>
        <Field label="Expected Arrival">
          <Input name="expectedArrival" type="date" />
        </Field>
        <Field label="Collection Address">
          <Input name="collectionAddress" />
        </Field>
        <Field label="Delivery Address">
          <Input name="deliveryAddress" />
        </Field>
        <Field label="Carrier">
          <Input name="carrier" />
        </Field>
        <Field label="Vessel">
          <Input name="vessel" />
        </Field>
        <Field label="Container Number">
          <Input name="containerNumber" />
        </Field>
        <Field label="Tracking Reference">
          <Input name="trackingReference" />
        </Field>
        <Field label="Vehicle Registration">
          <Input name="vehicleRegistration" />
        </Field>
        <Field label="VIN / Chassis">
          <Input name="vin" />
        </Field>
        <Field label="Make">
          <Input name="make" />
        </Field>
        <Field label="Model">
          <Input name="model" />
        </Field>
        <Field label="Weight (kg)">
          <Input name="weight" type="number" step="0.01" />
        </Field>
        <Field label="Volume (m³)">
          <Input name="volume" type="number" step="0.01" />
        </Field>
        <Field label="Amount Paid / Deposit (USD)">
          <Input name="amountPaid" type="number" step="0.01" min="0" placeholder="0.00" />
        </Field>

        <Field label="Notes" className="md:col-span-3">
          <Textarea name="notes" placeholder="Cargo details, special instructions…" />
        </Field>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Submit />
      </div>
    </form>
  );
}
