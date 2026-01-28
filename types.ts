export type PublicKeyString = string;

export interface EngineConfig {
  cluster: 'mainnet-beta' | 'devnet';
  rpcUrl: string;
  signerKeypairPath: string;

  lipMint: PublicKeyString;
  feeMint: PublicKeyString; // e.g., USDC mint
  feeVault: PublicKeyString;

  minFeeBalance: string; // in feeMint units, decimal string
  maxBuyAmount: string;  // in feeMint units, decimal string
  cooldownSeconds: number;
  slippageBps: number;

  randomizeWindowSeconds: number; // 0 disables
  dryRun: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface Quote {
  inAmount: bigint;
  outAmount: bigint;
  minOutAmount: bigint;
  routeLabel: string;
}

export interface SwapResult {
  signature: string;
  spentAmount: bigint;
  receivedAmount: bigint;
}
