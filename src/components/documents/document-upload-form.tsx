"use client";

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { registerDocument } from "@/lib/actions/expenses-notes";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { DOCUMENT_TYPES } from "@/lib/constants";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Uploading…" : "Upload"}</Button>;
}

export function DocumentUploadForm({
  shipments,
}: {
  shipments: { id: string; label: string }[];
}) {
  const router = useRouter();
  return (
    <form
      action={async (fd) => {
        await registerDocument(fd);
        router.refresh();
        router.push("/documents");
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
        <Field label="File Name" hint="e.g. Bill of Lading.pdf">
          <Input name="fileName" required placeholder="document.pdf" />
        </Field>
        <Field label="Document Type">
          <Select name="type" defaultValue="OTHER">
            {DOCUMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="mt-6">
        <Submit />
      </div>
    </form>
  );
}
