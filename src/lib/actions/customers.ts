"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logActivity } from "./shipments";

function str(v: FormDataEntryValue | null): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s;
}
function nil(v: FormDataEntryValue | null): string | null {
  const s = str(v);
  return s === "" ? null : s;
}

export async function createCustomer(formData: FormData) {
  const fullName = str(formData.get("fullName"));
  if (!fullName) return;

  const customer = await prisma.customer.create({
    data: {
      fullName,
      businessName: nil(formData.get("businessName")),
      phone: str(formData.get("phone")),
      whatsapp: nil(formData.get("whatsapp")),
      email: nil(formData.get("email")),
      address: nil(formData.get("address")),
      country: str(formData.get("country")) || "Zimbabwe",
      customerType: (str(formData.get("customerType")) || "INDIVIDUAL") as any,
      notes: nil(formData.get("notes")),
      isDemo: undefined,
    } as any,
  });

  await logActivity({
    action: "CUSTOMER_CREATED",
    description: `Customer ${customer.fullName} created.`,
    customerId: customer.id,
    actorId: undefined,
  });

  revalidatePath("/customers");
  redirect(`/customers/${customer.id}`);
}
