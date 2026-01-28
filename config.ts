import type { EngineConfig } from '@lip/core';

function req(v: string | undefined, name: string): string {
  if (!v) throw new Error(`missing env ${name}`);
  return v;
}

function num(v: string | undefined, name: string): number {
  const n = Number(req(v, name));
  if (!Number.isFinite(n)) throw new Error(`env ${name} must be a number`);
  return n;
}

export function loadConfigFromEnv(env: NodeJS.ProcessEnv): EngineConfig {
  const cluster = (env.CLUSTER ?? 'devnet') as EngineConfig['cluster'];
  const logLevel = (env.LOG_LEVEL ?? 'info') as EngineConfig['logLevel'];

  return {
    cluster,
    rpcUrl: req(env.RPC_URL, 'RPC_URL'),
    signerKeypairPath: req(env.SIGNER_KEYPAIR_PATH, 'SIGNER_KEYPAIR_PATH'),

    lipMint: req(env.LIP_MINT, 'LIP_MINT'),
    feeMint: req(env.FEE_MINT, 'FEE_MINT'),
    feeVault: req(env.FEE_VAULT, 'FEE_VAULT'),

    minFeeBalance: req(env.MIN_FEE_BALANCE, 'MIN_FEE_BALANCE'),
    maxBuyAmount: req(env.MAX_BUY_AMOUNT, 'MAX_BUY_AMOUNT'),
    cooldownSeconds: num(env.COOLDOWN_SECONDS, 'COOLDOWN_SECONDS'),
    slippageBps: num(env.SLIPPAGE_BPS, 'SLIPPAGE_BPS'),

    randomizeWindowSeconds: num(env.RANDOMIZE_WINDOW_SECONDS ?? '0', 'RANDOMIZE_WINDOW_SECONDS'),
    dryRun: (env.DRY_RUN ?? 'true').toLowerCase() === 'true',
    logLevel,
  };
}
