import type pino from 'pino';
import fetch from 'node-fetch';
import type { Keypair } from '@solana/web3.js';
import { Connection, Transaction } from '@solana/web3.js';

export class JupiterFullAdapter {
  constructor(private readonly rpcUrl: string, private readonly log: pino.Logger) {}

  async quote(params: {
    inputMint: string;
    outputMint: string;
    amount: string;
    slippageBps: number;
  }): Promise<any> {
    const url = new URL('https://quote-api.jup.ag/v6/quote');
    url.searchParams.set('inputMint', params.inputMint);
    url.searchParams.set('outputMint', params.outputMint);
    url.searchParams.set('amount', params.amount);
    url.searchParams.set('slippageBps', String(params.slippageBps));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`quote failed: ${res.status}`);
    return res.json();
  }

  async swap(args: { quoteResponse: any; signer: Keypair }): Promise<string> {
    const body = {
      quoteResponse: args.quoteResponse,
      userPublicKey: args.signer.publicKey.toBase58(),
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: 'auto',
    };

    const res = await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`swap failed: ${res.status}`);
    const data: any = await res.json();

    const txBuf = Buffer.from(data.swapTransaction, 'base64');
    const tx = Transaction.from(txBuf);
    tx.partialSign(args.signer);

    const conn = new Connection(this.rpcUrl, { commitment: 'confirmed' });
    const sig = await conn.sendRawTransaction(tx.serialize(), { skipPreflight: false, maxRetries: 3 });
    this.log.info({ sig }, 'sent swap transaction');
    await conn.confirmTransaction(sig, 'confirmed');
    return sig;
  }
}
