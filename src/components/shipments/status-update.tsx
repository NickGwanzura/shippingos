"use client";

import { useTransition } from "react";
import { updateShipmentStatus } from "@/lib/actions/shipments";
import { Select, Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/constants";

export function StatusUpdateControl({
  shipmentId,
  current,
}: {
  shipmentId: string;
  current: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const nextOptions = ALL_STATUSES.filter((s) => s !== current);

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const status = String(form.get("status"));
    start(async () => {
      await updateShipmentStatus(shipmentId, status);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handle} className="flex flex-wrap items-end gap-2">
      <Field label="Update status">
        <Select name="status" defaultValue="" required className="min-w-[200px]">
          {current && (
            <option value={current}>
              {STATUS_LABELS[current as keyof typeof STATUS_LABELS] ?? current}
              {" (current)"}
            </option>
          )}
          {nextOptions.map((s) => (
            <option key={s} value={s}>
              Move to → {STATUS_LABELS[s as keyof typeof STATUS_LABELS]}
            </option>
          ))}
        </Select>
      </Field>
      <Button type="submit" size="md" disabled={pending}>
        {pending ? "Updating…" : "Update"}
      </Button>
    </form>
  );
}
