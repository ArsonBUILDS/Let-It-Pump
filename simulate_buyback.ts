/**
 * Simulate guardrails spend calculation across different balances.
 * Usage: node scripts/simulate_buyback.ts
 */
import { Guardrails } from '../pump-engine/src/lib/guardrails.js';

const cfg: any = {
  minFeeBalance: '0.05',
  maxBuyAmount: '0.02',
};
const g = new Guardrails(cfg, console as any);

const samples = ['0.01', '0.05', '0.06', '0.10', '0.50', '1.00'];
function toBase(d: string): bigint {
  const decimals = 9n;
  const [w, f = ''] = d.split('.');
  const fp = (f + '0'.repeat(Number(decimals))).slice(0, Number(decimals));
  return BigInt(w) * 10n ** decimals + BigInt(fp);
}

for (const s of samples) {
  const bal = toBase(s);
  const spend = g.computeSpendAmount(bal);
  console.log({ balance: s, spendBase: spend.toString() });
}
