import test from 'node:test';
import assert from 'node:assert/strict';
import { Guardrails } from '../src/lib/guardrails.js';

function baseUnits(decimal: string): bigint {
  const decimals = 9n;
  const [w, f = ''] = decimal.split('.');
  const fp = (f + '0'.repeat(Number(decimals))).slice(0, Number(decimals));
  return BigInt(w) * 10n ** decimals + BigInt(fp);
}

test('guardrails spends nothing below min', () => {
  const g = new Guardrails({ minFeeBalance: '0.05', maxBuyAmount: '0.02' } as any, console as any);
  assert.equal(g.computeSpendAmount(baseUnits('0.01')), 0n);
});

test('guardrails spends up to max buy', () => {
  const g = new Guardrails({ minFeeBalance: '0.05', maxBuyAmount: '0.02' } as any, console as any);
  const spend = g.computeSpendAmount(baseUnits('1.00'));
  assert.ok(spend > 0n);
  // should never exceed maxBuyAmount in base units
  assert.ok(spend <= baseUnits('0.02'));
});
