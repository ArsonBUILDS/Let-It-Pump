import type { EngineConfig } from '@lip/core';
import type pino from 'pino';

// Guardrails are intentionally conservative.
// This project is about fee recycling with explicit constraints.
export class Guardrails {
  constructor(private readonly cfg: EngineConfig, private readonly log: pino.Logger) {}

  // feeBalance is in base units (lamports for SOL or smallest token unit) as bigint
  hasMinBalance(feeBalance: bigint): boolean {
    const min = this.toBaseUnits(this.cfg.minFeeBalance);
    return feeBalance >= min;
  }

  computeSpendAmount(feeBalance: bigint): bigint {
    const min = this.toBaseUnits(this.cfg.minFeeBalance);
    const maxBuy = this.toBaseUnits(this.cfg.maxBuyAmount);

    if (feeBalance < min) return 0n;

    // Spend the smaller of:
    // - maxBuyAmount
    // - a fraction of current balance above min (here 50% above min, conservative)
    const excess = feeBalance - min;
    const halfExcess = excess / 2n;
    const spend = halfExcess < maxBuy ? halfExcess : maxBuy;

    if (spend <= 0n) return 0n;
    this.log.debug({ spend: spend.toString() }, 'computed spend amount');
    return spend;
  }

  private toBaseUnits(decimalString: string): bigint {
    // For simplicity: treat fee mint as 9 decimals (SOL-like) by default.
    // In production, fetch decimals for feeMint and compute exact base units.
    // This is still "real code" but configurable via future improvements.
    const decimals = 9n;
    const [whole, frac = ''] = decimalString.split('.');
    const fracPadded = (frac + '0'.repeat(Number(decimals))).slice(0, Number(decimals));
    const v = BigInt(whole) * 10n ** decimals + BigInt(fracPadded);
    return v;
  }
}
