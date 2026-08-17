"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  add,
  subtract,
  profitMargin,
  type Money,
} from "@/lib/money";

function nums(v: FormDataEntryValue | null): number {
  const n = typeof v === "string" ? v.trim() : "";
  return n === "" ? 0 : parseFloat(n);
}
function optStr(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s === "" ? null : s;
}
function dnum(v: Money | number): number {
  return typeof v === "object" && "toNumber" in v ? v.toNumber() : Number(v);
}

function recalcShipmentFinancials(
  invoiceTotal: number,
  amountPaid: number,
  expensesTotal: number,
) {
  const outstanding = subtract(invoiceTotal, amountPaid);
  const revenue = invoiceTotal; // recognized revenue from confirmed invoice
  const profit = subtract(revenue, expensesTotal);
  const margin = profitMargin(profit, revenue);
  const paymentStatus =
    invoiceTotal <= 0
      ? "UNPAID"
      : amountPaid >= invoiceTotal
        ? "PAID"
        : amountPaid > 0
          ? "PARTIALLY_PAID"
          : "UNPAID";
  return { outstanding, revenue, profit, profitMargin: margin, paymentStatus };
}

function parseDate(v: FormDataEntryValue | null): Date | null {
  if (typeof v !== "string" || !v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

export async function createShipment(formData: FormData) {
  const session = await auth();
  const actorId = session?.user?.id;
  const customerId = String(formData.get("customerId"));

  const invoiceTotal = nums(formData.get("invoiceTotal"));
  const amountPaid = nums(formData.get("amountPaid"));
  const expenses = recalcShipmentFinancials(invoiceTotal, amountPaid, 0);

  const ship = await prisma.shipment.create({
    data: {
      shipmentNumber: `SHIP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId,
      shipmentType: String(formData.get("shipmentType") || "General Cargo"),
      status: "ENQUIRY",
      paymentStatus: "UNPAID",
      origin: String(formData.get("origin") || "—"),
      destination: String(formData.get("destination") || "—"),
      collectionAddress: optStr(formData.get("collectionAddress")),
      deliveryAddress: optStr(formData.get("deliveryAddress")),
      departureDate: parseDate(formData.get("departureDate")),
      expectedArrival: parseDate(formData.get("expectedArrival")),
      carrier: optStr(formData.get("carrier")),
      vessel: optStr(formData.get("vessel")),
      containerNumber: optStr(formData.get("containerNumber")),
      trackingReference: optStr(formData.get("trackingReference")),
      vehicleRegistration: optStr(formData.get("vehicleRegistration")),
      vin: optStr(formData.get("vin")),
      make: optStr(formData.get("make")),
      model: optStr(formData.get("model")),
      year: undefined,
      weight: nums(formData.get("weight")) || null,
      volume: nums(formData.get("volume")) || null,
      notes: optStr(formData.get("notes")),
      assignedStaffId: optStr(formData.get("assignedStaffId")),
      invoiceTotal,
      amountPaid,
      outstanding: expenses.outstanding,
      revenue: expenses.revenue,
      expensesTotal: 0,
      profit: expenses.profit,
      profitMargin: expenses.profitMargin,
      isDemo: true,
    },
  });

  // optional initial invoice + deposit
  if (invoiceTotal > 0) {
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-2026-${Math.floor(3000 + Math.random() * 9000)}`,
        customerId,
        shipmentId: ship.id,
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 86400000),
        total: invoiceTotal,
        amountPaid,
        balance: expenses.outstanding,
        currency: "USD",
        status: amountPaid > 0 ? "PARTIALLY_PAID" : "SENT",
        isDemo: true,
      },
    });
  }
  if (amountPaid > 0) {
    await prisma.payment.create({
      data: {
        customerId,
        shipmentId: ship.id,
        amount: amountPaid,
        currency: "USD",
        method: "BANK_TRANSFER",
        reference: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
        receivedById: actorId,
        receiptNumber: `RCT-${Math.floor(1000 + Math.random() * 9000)}`,
        isDemo: true,
      },
    });
  }

  await logActivity({
    action: "SHIPMENT_CREATED",
    description: `Shipment ${ship.shipmentNumber} created for customer ${customerId.slice(0, 8)}.`,
    customerId,
    shipmentId: ship.id,
    actorId,
  });

  revalidatePath("/shipments");
  revalidatePath("/dashboard");
  redirect(`/shipments/${ship.id}`);
}

export async function updateShipmentStatus(shipmentId: string, status: string) {
  const session = await auth();
  const actorId = session?.user?.id;
  const ship = await prisma.shipment.findUnique({ where: { id: shipmentId } });
  if (!ship) return;

  const isDelivered = status === "DELIVERED";
  const isCancelled = status === "CANCELLED";
  const data: any = { status };
  if (isDelivered) {
    data.actualArrival = new Date();
    data.deliveredAt = new Date();
  }
  if (isCancelled) data.deliveredAt = null;

  await prisma.shipment.update({ where: { id: shipmentId }, data });
  await logActivity({
    action: isDelivered ? "SHIPMENT_DELIVERED" : "STATUS_UPDATED",
    description: `${ship.shipmentNumber} status → ${status.replace(/_/g, " ")}.`,
    customerId: ship.customerId,
    shipmentId,
    actorId,
  });
  revalidatePath(`/shipments/${shipmentId}`);
  revalidatePath("/shipments");
  revalidatePath("/dashboard");
}

export async function recordPayment(formData: FormData) {
  const session = await auth();
  const actorId = session?.user?.id;
  const shipmentId = String(formData.get("shipmentId"));
  const amount = nums(formData.get("amount"));
  const method = String(formData.get("method") || "BANK_TRANSFER");
  const reference = optStr(formData.get("reference"));

  const ship = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { invoices: true },
  });
  if (!ship || amount <= 0) return;

  const invoice = ship.invoices.find((i) => i.balance.gt(0));

  const payment = await prisma.payment.create({
    data: {
      customerId: ship.customerId,
      invoiceId: invoice?.id,
      shipmentId,
      amount,
      currency: "USD",
      method: method as any,
      reference,
      receivedById: actorId,
      receiptNumber: `RCT-${Math.floor(1000 + Math.random() * 9000)}`,
      isDemo: true,
    },
  });

  const newPaidTotal = add(dnum(ship.amountPaid), amount);
  const expenses = recalcShipmentFinancials(
    dnum(ship.invoiceTotal),
    newPaidTotal,
    dnum(ship.expensesTotal),
  );
  await prisma.shipment.update({
    where: { id: shipmentId },
    data: {
      amountPaid: newPaidTotal,
      outstanding: expenses.outstanding,
      paymentStatus: expenses.paymentStatus,
    },
  });

  if (invoice) {
    const invNewPaid = add(dnum(invoice.amountPaid), amount);
    const status =
      invNewPaid >= dnum(invoice.total) ? "PAID" : "PARTIALLY_PAID";
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        amountPaid: invNewPaid,
        balance: subtract(dnum(invoice.total), invNewPaid),
        status: status as any,
      },
    });
  }

  await logActivity({
    action: "PAYMENT_RECORDED",
    description: `Payment of $${amount.toFixed(2)} recorded for ${ship.shipmentNumber}.`,
    customerId: ship.customerId,
    shipmentId,
    actorId,
  });
  revalidatePath(`/shipments/${shipmentId}`);
  revalidatePath("/dashboard");
  revalidatePath("/payments");
  redirect(`/shipments/${shipmentId}`);
}

export async function logActivity(args: {
  action: any;
  description: string;
  customerId?: string | null;
  shipmentId?: string | null;
  actorId?: string | null;
}) {
  await prisma.activityLog.create({
    data: {
      action: args.action,
      description: args.description,
      customerId: args.customerId ?? null,
      shipmentId: args.shipmentId ?? null,
      actorId: args.actorId ?? null,
    },
  }).catch(() => {});
}
