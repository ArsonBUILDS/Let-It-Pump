# Security Policy

## Reporting a Vulnerability
If you believe you have found a security vulnerability, please do not open a public issue.

Email: security@letitpump.example

Include:
- What you found and where
- Steps to reproduce
- Potential impact

We will acknowledge receipt within 72 hours and coordinate a fix.

## Scope
This repository contains off-chain automation code that can sign transactions.
Treat keys as production secrets.

- Never commit private keys, seed phrases, or API tokens
- Prefer hardware wallets or delegated signing where possible
- Use rate limits and max-buy constraints
