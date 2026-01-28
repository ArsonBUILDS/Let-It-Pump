# Contributing

Thanks for your interest in contributing to Let It Pump (LIP).

## Quick Start
1. Fork the repo
2. Create a feature branch
3. Run checks locally
4. Open a PR

## Development
- Node 20+
- pnpm recommended

### Commands
- pnpm install
- pnpm lint
- pnpm test
- pnpm build

## Code Style
- TypeScript strict mode
- ESLint + Prettier
- Small modules with explicit interfaces
- Do not add "pump the chart" language. Use "buyback", "fee recycling", "market buy".

## Security
Never add code that:
- spoofs volume
- wash trades
- front-runs users
- manipulates pricing via deceptive behavior

This project is about automated buybacks funded by realized value with clear guardrails.
