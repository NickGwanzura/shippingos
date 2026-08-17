"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { add, subtract, dnum } from "@/lib/money";
import { logActivity } from "./shipments";

function n(v: FormDataEntryValue | null): number {
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? 0 : parseFloat(s);
}
function str(v: FormDataEntryValue | null): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s;
}

export async function createQuote(formData: FormData) {
  const session = await auth();
  const customerId = str(formData.get("customerId"));
  if (!customerId) return;

  const freight = n(formData.get("freightCharge"));
  const collection = n(formData.get("collectionFee"));
  const clearing = n(formData.get("clearingFee"));
  const insurance = n(formData.get("insurance"));
  const delivery = n(formData.get("deliveryFee"));
  const storage = n(formData.get("storage"));
  const other = n(formData.get("otherCharges"));
  const discount = n(formData.get("discount"));
  const deposit = n(formData.get("depositRequired"));
  const total = freight + collection + clearing + insurance + delivery + storage + other - discount;

  const quote = await prisma.quote.create({
    data: {
      quoteNumber: `QT-2026-${Math.floor(1001 + Math.random() * 9000)}`,
      customerId,
      shipmentType: str(formData.get("shipmentType")) || "General Cargo",
      origin: str(formData.get("origin")),
      destination: str(formData.get("destination")),
      cargoDescription: str(formData.get("cargoDescription")),
      freightCharge: freight,
      collectionFee: collection,
      clearingFee: clearing,
      insurance,
      deliveryFee: delivery,
      storage,
      otherCharges: other,
      discount,
      total,
      depositRequired: deposit,
      currency: "USD",
      status: "DRAFT",
      expiryDate: str(formData.get("expiryDate")) ? new Date(str(formData.get("expiryDate"))) : null,
      issuedById: session?.user?.id ?? undefined,
      isDemo: true,
    },
  });

  await logActivity({
    action: "QUOTE_CREATED",
    description: `Quote ${quote.quoteNumber} created.`,
    customerId,
    actorId: session?.user?.id,
  });
  revalidatePath("/quotes");
  redirect(`/quotes/${quote.id}`);
}

export async function markQuoteStatus(quoteId: string, status: string) {
  await prisma.quote.update({ where: { id: quoteId }, data: { status: status as any } });
  revalidatePath(`/quotes/${quoteId}`);
  revalidatePath("/quotes");
  revalidatePath("/dashboard");
}

// ------------------------------------------------------------
// Convert a quote into a shipment (the core demo flow).
// ------------------------------------------------------------
export async function convertQuoteToShipment(quoteId: string) {
  const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
  if (!quote || quote.status === "CONVERTED") return null;

  const total = dnum(quote.total);
  const deposit = dnum(quote.depositRequired);

  const shipment = await prisma.shipment.create({
    data: {
      shipmentNumber: `SHIP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: quote.customerId,
      quoteId: quote.id,
      shipmentType: quote.shipmentType,
      status: "BOOKED",
      paymentStatus: "UNPAID",
      origin: quote.origin,
      destination: quote.destination,
      invoiceTotal: total,
      amountPaid: 0,
      outstanding: total,
      revenue: total,
      expensesTotal: 0,
      profit: total,
      profitMargin: 100,
      isDemo: true,
    },
  });

  // Mark quote converted.
  await prisma.quote.update({
    where: { id: quote.id },
    data: { status: "CONVERTED" },
  });

  // Create invoice for the quote total.
  await prisma.invoice.create({
    data: {
      invoiceNumber: `INV-2026-${Math.floor(3000 + Math.random() * 9000)}`,
      customerId: quote.customerId,
      shipmentId: shipment.id,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 86400000),
      total,
      amountPaid: 0,
      balance: total,
      currency: "USD",
      status: "SENT",
      isDemo: true,
    },
  });

  await logActivity({
    action: "QUOTE_ACCEPTED",
    description: `Quote ${quote.quoteNumber} converted to ${shipment.shipmentNumber}.`,
    customerId: quote.customerId,
    shipmentId: shipment.id,
    actorId: undefined,
  });

  revalidatePath("/quotes");
  revalidatePath(`/quotes/${quote.id}`);
  revalidatePath("/shipments");
  return shipment.id;
}
