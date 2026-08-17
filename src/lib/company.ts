import { prisma } from "@/lib/db";

export interface CompanyConfig {
  companyName: string;
  tagline: string;
  logoUrl: string | null;
  primaryColor: string;
  currency: string;
  supportPhone: string;
  supportEmail: string;
  whatsappNumber: string;
  salesWhatsapp: string;
  website: string;
  presentationMode: boolean;
  modules: string[];
}

let cache: CompanyConfig | null = null;

/** Returns the single-tenant company configuration (cached per server process). */
export async function getCompanyConfig(): Promise<CompanyConfig> {
  if (cache) return cache;
  const row = await prisma.companySettings.findFirst();
  const settings = row ?? {
    companyName: "Horizon Freight & Logistics",
    tagline: "Moving Business Forward",
    logoUrl: null,
    primaryColor: "#0B3B8C",
    currency: "USD",
    supportPhone: "",
    supportEmail: "hello@horizonfreight.co.zw",
    whatsappNumber: "",
    salesWhatsapp: "",
    website: "https://horizonfreight.example",
    presentationMode: false,
    modules: "",
  };
  cache = {
    companyName: settings.companyName,
    tagline: settings.tagline,
    logoUrl: settings.logoUrl,
    primaryColor: settings.primaryColor,
    currency: settings.currency,
    supportPhone: settings.supportPhone,
    supportEmail: settings.supportEmail,
    whatsappNumber: settings.whatsappNumber,
    salesWhatsapp: settings.salesWhatsapp,
    website: settings.website,
    presentationMode: settings.presentationMode,
    modules: settings.modules.split(",").map((m) => m.trim()).filter(Boolean),
  };
  return cache;
}

export async function clearCompanyConfigCache() {
  cache = null;
}
