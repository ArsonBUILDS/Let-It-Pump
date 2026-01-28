import type { EngineConfig } from '@lip/core';
import type pino from 'pino';
import { nowSeconds, sleep, withRetry } from '@lip/core';
import { SolanaClient } from './solana.js';
import { JupiterRouter } from './jupiter.js';
import { Guardrails } from './guardrails.js';
import { StateStore } from './state.js';

export class Engine {
  private readonly solana: SolanaClient;
  private readonly jupiter: JupiterRouter;
  private readonly guardrails: Guardrails;
  private readonly state: StateStore;

  constructor(private readonly cfg: EngineConfig, private readonly log: pino.Logger) {
    this.solana = new SolanaClient(cfg, log);
    this.jupiter = new JupiterRouter(cfg, log);
    this.guardrails = new Guardrails(cfg, log);
    this.state = new StateStore();
  }

  async runForever(): Promise<void> {
    // Tight loop but with sleeps, built for long-running service.
    while (true) {
      await this.tickOnce();
      await sleep(5_000);
    }
  }

  private async tickOnce(): Promise<void> {
    const now = nowSeconds();

    // cooldown guard
    const last = this.state.getLastBuybackAt();
    if (last && now - last < this.cfg.cooldownSeconds) {
      this.log.debug({ until: this.cfg.cooldownSeconds - (now - last) }, 'cooldown active');
      return;
    }

    // optional random window
    if (this.cfg.randomizeWindowSeconds > 0) {
      const jitter = Math.floor(Math.random() * this.cfg.randomizeWindowSeconds);
      this.log.debug({ jitter }, 'random window sleep');
      await sleep(jitter * 1000);
    }

    const feeBalance = await withRetry(() => this.solana.getTokenBalance(this.cfg.feeVault), {
      retries: 3,
      baseMs: 500,
      maxMs: 5_000,
      jitter: 0.2,
    });

    if (!this.guardrails.hasMinBalance(feeBalance)) {
      this.log.info({ feeBalance }, 'fee balance below threshold');
      return;
    }

    const spend = this.guardrails.computeSpendAmount(feeBalance);
    if (spend <= 0n) return;

    // Get quote and perform swap (or dry run)
    const quote = await this.jupiter.getQuote({
      inMint: this.cfg.feeMint,
      outMint: this.cfg.lipMint,
      inAmount: spend,
      slippageBps: this.cfg.slippageBps,
    });

    this.log.info(
      { spend: spend.toString(), outMin: quote.minOutAmount.toString(), route: quote.routeLabel },
      'prepared buyback quote',
    );

    if (this.cfg.dryRun) {
      this.log.warn('dry run enabled, not sending swap');
      this.state.setLastBuybackAt(nowSeconds());
      return;
    }

    // Execute swap
    const res = await this.jupiter.executeSwap({
      quote,
      signer: await this.solana.loadSigner(),
    });

    this.log.info({ sig: res.signature, spent: res.spentAmount.toString() }, 'buyback executed');
    this.state.setLastBuybackAt(nowSeconds());
  }
}
