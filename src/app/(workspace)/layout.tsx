import { auth } from "@/lib/auth";
import { getCompanyConfig } from "@/lib/company";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { QuickActions } from "@/components/layout/quick-actions";
import { TopBar } from "@/components/layout/top-bar";
import { SalesCTA } from "@/components/sales-cta";
import { DemoBar } from "@/components/demo/demo-bar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const config = await getCompanyConfig();
  const name = session?.user?.name ?? "User";

  let roleLabel = "Operations";
  if (session?.user?.role) {
    roleLabel = session.user.role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DemoBar isSuperAdmin={session?.user?.role === "SUPER_ADMIN"} />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <Sidebar userName={name} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar userName={name} roleLabel={roleLabel} />
          <main className="flex-1 px-4 pb-28 pt-4 md:px-8 md:pb-10 md:pt-6">
            {children}
          </main>
        </div>
        <BottomNav />
        <QuickActions />
        <SalesCTA whatsappNumber={config.salesWhatsapp} />
      </div>
    </div>
  );
}
