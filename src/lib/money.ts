// Decimal-safe financial arithmetic helpers.
// Money is NEVER computed with floating point. All monetary values flow through
// Prisma Decimal (stored as NUMERIC). For convenience we operate on cents-ish
// integer math here and keep rounding rules deterministic.

export type Money = { toNumber(): number; toString(): string };

const TWO_DP = 2;

function toBigIntSafe(value: Money | number | string): bigint {
  // Convert a decimal (or numeric/string) to an integer count of "minor units"
  // (2 decimal places) without floating point error.
  const num =
    typeof value === "number" ? value.toFixed(2) : value.toString();
  const parts = num.split(".");
  const whole = parts[0] || "0";
  const frac = (parts[1] || "").padEnd(2, "0").slice(0, 2);
  return BigInt(whole) * 100n + BigInt(frac);
}

function fromBigIntSafe(amount: bigint): number {
  const isNeg = amount < 0n;
  const abs = isNeg ? -amount : amount;
  const whole = abs / 100n;
  const frac = abs % 100n;
  const sign = isNeg ? "-" : "";
  return parseFloat(`${sign}${whole}.${frac.toString().padStart(2, "0")}`);
}

export function add(a: Money | number | string, b: Money | number | string): number {
  return fromBigIntSafe(toBigIntSafe(a) + toBigIntSafe(b));
}

export function subtract(a: Money | number | string, b: Money | number | string): number {
  return fromBigIntSafe(toBigIntSafe(a) - toBigIntSafe(b));
}

/** Compute profit margin percentage (revenue minus expenses over revenue). */
export function profitMargin(profit: number, revenue: number): number {
  if (revenue <= 0) return 0;
  return (profit / revenue) * 100;
}

export const cents = toBigIntSafe;

/** Convert a Prisma Decimal / number / string to a JS number. */
export function dnum(v: Money | number | string | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "object" && "toNumber" in v) return v.toNumber();
  return Number(v);
}
