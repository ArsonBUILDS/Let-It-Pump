import type { EngineConfig } from '@lip/core';
import type pino from 'pino';
import fs from 'node:fs';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

// Minimal Solana client wrapper
export class SolanaClient {
  private readonly conn: Connection;

  constructor(private readonly cfg: EngineConfig, private readonly log: pino.Logger) {
    this.conn = new Connection(cfg.rpcUrl, { commitment: 'confirmed' });
  }

  async loadSigner(): Promise<Keypair> {
    const raw = fs.readFileSync(this.cfg.signerKeypairPath, 'utf-8');
    const secret = Uint8Array.from(JSON.parse(raw) as number[]);
    const kp = Keypair.fromSecretKey(secret);
    this.log.debug({ pubkey: kp.publicKey.toBase58() }, 'loaded signer');
    return kp;
  }

  async getTokenBalance(tokenAccount: string): Promise<bigint> {
    const pk = new PublicKey(tokenAccount);
    const bal = await this.conn.getTokenAccountBalance(pk, 'confirmed');
    // amount is a string in base units
    return BigInt(bal.value.amount);
  }
}
