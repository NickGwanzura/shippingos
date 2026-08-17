"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { registerDocument } from "@/lib/actions/expenses-notes";
import { Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { DOCUMENT_TYPES } from "@/lib/constants";

export function AddDocumentForm({ shipmentId }: { shipmentId: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  return (
    <form
      ref={ref}
      action={async (fd) => {
        await registerDocument(fd);
        ref.current?.reset();
        router.refresh();
      }}
      className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
    >
      <p className="text-xs font-semibold text-slate-600">Register a document</p>
      <input type="hidden" name="shipmentId" value={shipmentId} />
      <div className="flex flex-wrap gap-2">
        <Input name="fileName" required placeholder="File name (e.g. Bill of Lading.pdf)" className="flex-1 min-w-[180px]" />
        <Select name="type" defaultValue="OTHER" className="w-48">
          {DOCUMENT_TYPES.map((t) => (
            <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
          ))}
        </Select>
        <Button type="submit" size="sm" variant="outline">Upload</Button>
      </div>
    </form>
  );
}
