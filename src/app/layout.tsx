import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

// Pages use live business data. This also keeps image builds independent from
// the database, which is provisioned when the production container starts.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Horizon Freight & Logistics",
    template: "%s · Horizon Freight",
  },
  description:
    "Shipping & Logistics Management System — track every shipment, customer balance, documents and profitability.",
  applicationName: "Horizon Freight OS",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b3b8c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={publicSans.variable}>{children}</body>
    </html>
  );
}
