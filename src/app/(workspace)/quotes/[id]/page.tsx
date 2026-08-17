import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Printer, Send, PackagePlus, FilePlus2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { add, dnum } from "@/lib/money";
import { fmtMoney, fmtDate } from "@/lib/format";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuoteStatusBadge } from "@/lib/status";
import { WhatsAppButton } from "@/components/ui/whatsapp";
import { getCompanyConfig } from "@/lib/company";
import { convertQuoteToShipment, markQuoteStatus } from "@/lib/actions/quotes";

export const metadata = { title: "Quote Detail" };

export default async function QuoteDetailPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { customer: true, shipment: true },
  });
  if (!quote) notFound();
  const config = await getCompanyConfig();

  const q: any = quote;
  const lines = [
    { label: "Freight Charge", value: dnum(q.freightCharge) },
    { label: "Collection Fee", value: dnum(q.collectionFee) },
    { label: "Clearing Fee", value: dnum(q.clearingFee) },
    { label: "Insurance", value: dnum(q.insurance) },
    { label: "Delivery Fee", value: dnum(q.deliveryFee) },
    { label: "Storage", value: dnum(q.storage) },
    { label: "Other Charges", value: dnum(q.otherCharges) },
  ];

  async function handleConvert() {
    "use server";
    const shipId = await convertQuoteToShipment(q.id);
    redirect(shipId ? `/shipments/${shipId}` : `/quotes/${q.id}`);
  }
  async function handleSend() {
    "use server";
    await markQuoteStatus(q.id, "SENT");
    redirect(`/quotes/${q.id}`);
  }

  const waMessage = `Hello ${q.customer.fullName}, your ${config.companyName} quote ${q.quoteNumber} for ${q.cargoDescription} (${q.origin} → ${q.destination}) totals ${fmtMoney(dnum(q.total))}. View and accept: ${config.salesWhatsapp ? `${config.salesWhatsapp}` : ""}`;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Button href="/quotes" variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
        Back to quotes
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{q.quoteNumber}</h1>
          <p className="text-sm text-slate-500">
            {q.customer.fullName} · {q.shipmentType} · {q.origin} → {q.destination}
          </p>
          <div className="mt-1"><QuoteStatusBadge status={q.status} /></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={handleSend}>
            <Button type="submit" variant="secondary" size="sm" icon={<Send className="h-4 w-4" />}>
              Mark Sent
            </Button>
          </form>
          <Button href={`/quotes/${q.id}/print`} variant="outline" size="sm" icon={<Printer className="h-4 w-4" />}>
            Print
          </Button>
          <WhatsAppButton
            number={config.whatsappNumber}
            message={waMessage}
            label="WhatsApp"
            size="sm"
            variant="success"
          />
          {!q.shipment && (q.status === "ACCEPTED" || q.status === "SENT") && (
            <form action={handleConvert}>
              <Button type="submit" variant="primary" size="sm" icon={<PackagePlus className="h-4 w-4" />}>
                Convert to Shipment
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader title="Cargo & Route" />
          <CardBody className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Cargo</p>
              <p className="text-sm font-medium text-slate-800">{q.cargoDescription}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-slate-400">Origin</p><p className="font-medium">{q.origin}</p></div>
              <div><p className="text-xs text-slate-400">Destination</p><p className="font-medium">{q.destination}</p></div>
              <div><p className="text-xs text-slate-400">Issued</p><p className="font-medium">{fmtDate(q.createdAt)}</p></div>
              <div><p className="text-xs text-slate-400">Expires</p><p className="font-medium">{fmtDate(q.expiryDate)}</p></div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Quote Total" />
          <CardBody className="space-y-2">
            {lines
              .filter((l) => l.value > 0)
              .map((l) => (
                <div key={l.label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{l.label}</span>
                  <span className="tabular-nums">{fmtMoney(l.value)}</span>
                </div>
              ))}
            {dnum(q.discount) > 0 && (
              <div className="flex justify-between text-sm text-red-500">
                <span>Discount</span>
                <span className="tabular-nums">-{fmtMoney(dnum(q.discount))}</span>
              </div>
            )}
            <div className="my-1 border-t border-slate-100" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="tabular-nums text-brand">{fmtMoney(dnum(q.total))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Deposit Required</span>
              <span className="tabular-nums font-medium">{fmtMoney(dnum(q.depositRequired))}</span>
            </div>
            {q.shipment && (
              <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Converted to{" "}
                <Link href={`/shipments/${q.shipment.id}`} className="font-semibold underline">
                  {q.shipment.shipmentNumber}
                </Link>
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
