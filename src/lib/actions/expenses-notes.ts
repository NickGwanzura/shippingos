"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { dnum } from "@/lib/money";
import { logActivity } from "./shipments";

function n(v: FormDataEntryValue | null): number {
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? 0 : parseFloat(s);
}
function str(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s === "" ? null : s;
}

export async function addExpense(formData: FormData) {
  const session = await auth();
  const shipmentId = String(formData.get("shipmentId"));
  const amount = n(formData.get("amount"));
  if (amount <= 0 || !shipmentId) return;

  const ship = await prisma.shipment.findUnique({ where: { id: shipmentId } });
  if (!ship) return;

  await prisma.expense.create({
    data: {
      shipmentId,
      supplier: str(formData.get("supplier")),
      amount,
      currency: "USD",
      date: str(formData.get("date")) ? new Date(String(formData.get("date"))) : new Date(),
      category: String(formData.get("category") || "OTHER"),
      notes: str(formData.get("notes")) ?? undefined,
      isDemo: true,
    },
  });

  // Recompute shipment expenses, profit and margin.
  const expenses = await prisma.expense.aggregate({
    where: { shipmentId },
    _sum: { amount: true },
  });
  const expensesTotal = dnum(expenses._sum.amount ?? 0);
  const revenue = dnum(ship.revenue);
  const profit = revenue - expensesTotal;
  const profitMargin = revenue <= 0 ? 0 : (profit / revenue) * 100;

  await prisma.shipment.update({
    where: { id: shipmentId },
    data: { expensesTotal, profit, profitMargin },
  });

  await logActivity({
    action: "EXPENSE_ADDED",
    description: `Expense of $${amount.toFixed(2)} added to ${ship.shipmentNumber}.`,
    customerId: ship.customerId,
    shipmentId,
    actorId: session?.user?.id,
  });
  revalidatePath(`/shipments/${shipmentId}`);
  revalidatePath("/dashboard");
}

export async function addSupportNote(formData: FormData) {
  const session = await auth();
  const shipmentId = String(formData.get("shipmentId"));
  const note = String(formData.get("note") || "");
  if (!note.trim()) return;
  const ship = await prisma.shipment.findUnique({ where: { id: shipmentId } });
  if (!ship) return;
  await prisma.supportNote.create({
    data: {
      customerId: ship.customerId,
      shipmentId,
      note: note.trim(),
      isInternal: formData.get("isInternal") === "on",
      createdById: session?.user?.id,
    },
  });
  await logActivity({
    action: "NOTE_ADDED",
    description: `Note added to ${ship.shipmentNumber}.`,
    customerId: ship.customerId,
    shipmentId,
    actorId: session?.user?.id,
  });
  revalidatePath(`/shipments/${shipmentId}`);
}

export async function registerDocument(formData: FormData) {
  const session = await auth();
  const shipmentId = String(formData.get("shipmentId"));
  const fileName = String(formData.get("fileName") || "Untitled");
  const type = String(formData.get("type") || "OTHER");
  const ship = await prisma.shipment.findUnique({ where: { id: shipmentId } });
  if (!ship) return;

  await prisma.document.create({
    data: {
      shipmentId,
      customerId: ship.customerId,
      fileName,
      type: type as any,
      url: `/documents/${ship.shipmentNumber}/${fileName.replace(/\s+/g, "-")}`,
      uploadedById: session?.user?.id,
      isDemo: true,
    },
  });
  await logActivity({
    action: "DOCUMENT_UPLOADED",
    description: `Document "${fileName}" uploaded to ${ship.shipmentNumber}.`,
    customerId: ship.customerId,
    shipmentId,
    actorId: session?.user?.id,
  });
  revalidatePath(`/shipments/${shipmentId}`);
  revalidatePath("/documents");
}
