"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { addSupportNote } from "@/lib/actions/expenses-notes";
import { Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function AddNoteForm({ shipmentId }: { shipmentId: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  return (
    <form
      ref={ref}
      action={async (fd) => {
        await addSupportNote(fd);
        ref.current?.reset();
        router.refresh();
      }}
      className="space-y-2"
    >
      <input type="hidden" name="shipmentId" value={shipmentId} />
      <Textarea name="note" placeholder="Add a note or update…" />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs text-slate-500">
          <input type="checkbox" name="isInternal" className="rounded" />
          Internal only (hide from customer)
        </label>
        <Button type="submit" size="sm" variant="secondary">Add note</Button>
      </div>
    </form>
  );
}
