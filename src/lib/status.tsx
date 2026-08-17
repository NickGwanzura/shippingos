import { Badge } from "@/components/ui/badge";
import {
  STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";

type Tone = "brand" | "green" | "amber" | "red" | "slate" | "blue" | "purple" | "teal";

const STATUS_TONE: Record<string, Tone> = {
  ENQUIRY: "slate",
  QUOTED: "blue",
  BOOKED: "brand",
  AWAITING_COLLECTION: "brand",
  COLLECTED: "brand",
  AT_WAREHOUSE: "blue",
  READY_FOR_LOADING: "brand",
  LOADED: "brand",
  DEPARTED: "purple",
  IN_TRANSIT: "purple",
  ARRIVED_AT_PORT: "blue",
  CUSTOMS_PROCESSING: "amber",
  CUSTOMS_CLEARED: "teal",
  READY_FOR_COLLECTION: "teal",
  OUT_FOR_DELIVERY: "blue",
  DELIVERED: "green",
  ON_HOLD: "amber",
  CANCELLED: "red",
};

const QUOTE_TONE: Record<string, Tone> = {
  DRAFT: "slate", SENT: "blue", VIEWED: "blue", ACCEPTED: "green",
  REJECTED: "red", EXPIRED: "amber", CONVERTED: "teal",
};

const INVOICE_TONE: Record<string, Tone> = {
  DRAFT: "slate", SENT: "blue", PARTIALLY_PAID: "amber", PAID: "green",
  OVERDUE: "red", CANCELLED: "red",
};

const PAYMENT_TONE: Record<string, Tone> = {
  UNPAID: "amber", PARTIALLY_PAID: "blue", PAID: "green",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={STATUS_TONE[status] ?? "slate"}>
      {STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status.replace(/_/g, " ")}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={PAYMENT_TONE[status] ?? "slate"}>
      {PAYMENT_STATUS_LABELS[status] ?? status.replace(/_/g, " ")}
    </Badge>
  );
}

export function QuoteStatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={QUOTE_TONE[status] ?? "slate"}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function InvoiceStatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={INVOICE_TONE[status] ?? "slate"}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
