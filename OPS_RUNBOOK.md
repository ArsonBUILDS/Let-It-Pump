# Operations Runbook

This is an off-chain service that can sign transactions.

## Before you run
- Use a dedicated keypair with minimal permissions
- Fund signer with small SOL for fees
- Configure strict limits in env
- Use devnet first

## Recommended deployment
- Containerize the pump engine
- Run in a restricted environment
- Store secrets in a vault (not .env files committed to disk)
- Enable logs and metrics

## Monitoring
- Track: vault balance, last buyback time, buyback count, failures, RPC latency
- Alert on: repeated failures, balance anomalies, sudden price impact

## Rollback
- Disable scheduler (RUN_MODE=idle)
- Rotate keys if leaked
