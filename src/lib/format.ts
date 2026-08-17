import { format, formatDistanceToNow } from "date-fns";

/** Format a currency amount with 2 decimal places and a code. */
export function fmtMoney(
  value: number | string | { toNumber(): number } | null | undefined,
  currency = "USD",
): string {
  if (value == null) value = 0;
  const n =
    typeof value === "object" && "toNumber" in value
      ? value.toNumber()
      : Number(value);
  const symbol = currency === "USD" ? "$" : currency === "GBP" ? "£" : currency === "ZAR" ? "R" : "";
  return `${symbol}${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function fmtNumber(value: number | null | undefined): string {
  if (value == null) return "0";
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

export function fmtDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return isNaN(d.getTime()) ? "—" : format(d, "dd MMM yyyy");
}

export function fmtDateTime(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return isNaN(d.getTime()) ? "—" : format(d, "dd MMM yyyy · HH:mm");
}

export function timeAgo(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return "—";
  return formatDistanceToNow(d, { addSuffix: true });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function titleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
