import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { fmtMoney, fmtDate } from "@/lib/format";
import { dnum } from "@/lib/money";
import { getCompanyConfig } from "@/lib/company";

export const metadata = { title: "Print Quote" };

export default async function QuotePrintPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { customer: true },
  });
  if (!quote) notFound();
  const config = await getCompanyConfig();

  const q: any = quote;
  const lines = [
    ["Freight Charge", dnum(q.freightCharge)],
    ["Collection Fee", dnum(q.collectionFee)],
    ["Clearing Fee", dnum(q.clearingFee)],
    ["Insurance", dnum(q.insurance)],
    ["Delivery Fee", dnum(q.deliveryFee)],
    ["Storage", dnum(q.storage)],
    ["Other Charges", dnum(q.otherCharges)],
  ] as Array<[string, number]>;

  return (
    <div className="mx-auto max-w-3xl bg-white p-8 text-slate-900 print:shadow-none">
      <div className="flex items-start justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-xl font-bold text-brand">{config.companyName}</h1>
          <p className="text-sm text-slate-500">{config.tagline}</p>
          <p className="mt-2 text-xs text-slate-500">
            {config.supportPhone} · {config.supportEmail}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">Quotation</p>
          <p className="text-sm">{q.quoteNumber}</p>
          <p className="text-xs text-slate-500">Date: {fmtDate(q.createdAt)}</p>
        </div>
      </div>

      <div className="py-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Prepared for</h2>
        <p className="font-medium">{q.customer.fullName}</p>
        {q.customer.businessName && <p>{q.customer.businessName}</p>}
        <p className="text-sm text-slate-600">{q.customer.address ?? ""}</p>
      </div>

      <div className="rounded-lg border border-slate-200 p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-slate-500">Shipment Type</span><div className="font-medium">{q.shipmentType}</div></div>
          <div><span className="text-slate-500">Cargo</span><div className="font-medium">{q.cargoDescription}</div></div>
          <div><span className="text-slate-500">Origin</span><div className="font-medium">{q.origin}</div></div>
          <div><span className="text-slate-500">Destination</span><div className="font-medium">{q.destination}</div></div>
        </div>
      </div>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            <th className="py-2">Item</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lines
            .filter(([, v]) => v > 0)
            .map(([label, value]) => (
              <tr key={label as string} className="border-b border-slate-100">
                <td className="py-2">{label}</td>
                <td className="py-2 text-right tabular-nums">{fmtMoney(value)}</td>
              </tr>
            ))}
          {dnum(q.discount) > 0 && (
            <tr className="border-b border-slate-100">
              <td className="py-2">Discount</td>
              <td className="py-2 text-right tabular-nums text-red-500">-{fmtMoney(dnum(q.discount))}</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td className="py-3 text-base font-bold">Total</td>
            <td className="py-3 text-right text-base font-bold tabular-nums">{fmtMoney(dnum(q.total))}</td>
          </tr>
          <tr>
            <td className="text-sm text-slate-500">Deposit Required</td>
            <td className="text-right text-sm font-medium tabular-nums">{fmtMoney(dnum(q.depositRequired))}</td>
          </tr>
        </tfoot>
      </table>

      <p className="mt-8 text-sm text-slate-600">
        Valid until <span className="font-medium">{fmtDate(q.expiryDate)}</span>. Thank you for choosing{" "}
        {config.companyName}.
      </p>

      <div className="mt-10 text-center print:hidden">
        <button onClick={() => window.print()} className="rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white">
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
