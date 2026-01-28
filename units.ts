export function bpsToFloat(bps: number): number {
  if (!Number.isFinite(bps) || bps < 0) throw new Error('bps must be >= 0');
  return bps / 10_000;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}
