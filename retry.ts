import { sleep } from './units.js';

export interface RetryOpts {
  retries: number;
  baseMs: number;
  maxMs: number;
  jitter: number; // 0..1
}

export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOpts): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= opts.retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const exp = Math.min(opts.maxMs, opts.baseMs * 2 ** i);
      const jit = exp * opts.jitter * Math.random();
      await sleep(exp + jit);
    }
  }
  throw lastErr;
}
