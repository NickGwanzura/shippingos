import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCompanyConfig } from "@/lib/company";
import { PortalNav } from "@/components/portal/portal-nav";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Non-portal users are redirected to their own area.
  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/portal/login");
  }

  const config = await getCompanyConfig();
  const customer = await prisma.customer.findUnique({
    where: { id: session.user.id },
    select: { fullName: true, businessName: true },
  });

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/portal" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
              <PackageSearch className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-900">{config.companyName}</p>
              <p className="text-[10px] text-slate-400">Customer Portal</p>
            </div>
          </Link>
          <PortalNav
            customerName={customer?.fullName ?? "Customer"}
            businessName={customer?.businessName}
          />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 pb-20">{children}</main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        {config.companyName} · {config.tagline} · {config.supportPhone}
      </footer>
    </div>
  );
}
