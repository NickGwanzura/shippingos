// Deterministic, decimal-safe helpers for seed generation.

/** Build a Prisma Decimal-compatible 2dp value from a number without fp drift. */
export function money(n: number): { toFixed(dp: number): string; toString(): string } {
  return {
    toFixed: () => n.toFixed(2),
    toString: () => n.toFixed(2),
  };
}

/** Simple non-crypto hash → stable pseudo-random for seed dates/variation. */
export function seeded(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 10000;
  return x - Math.floor(x);
}

export function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}
