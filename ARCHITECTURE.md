# Architecture

Let It Pump (LIP) is an automated buyback engine.

## High-level flow

1. Fees accrue in a configured fee vault (token A, usually USDC or SOL).
2. The engine monitors vault balance and on-chain conditions.
3. When constraints are satisfied (threshold, cooldown, market health), the engine performs a market buy for LIP.
4. Purchased LIP is handled according to the selected mode:
   - burn
   - lock (time-based vault)
   - treasury

## Key constraints
- Min threshold before buyback
- Max buy size per interval
- Cooldown between buys
- Slippage limits
- Optional randomized execution window

## Safety
The engine is designed to be predictable and auditable. It is not designed to spoof volume or execute deceptive strategies.
