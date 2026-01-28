FROM node:20-alpine

WORKDIR /app

COPY . /app
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
RUN pnpm install --frozen-lockfile
RUN pnpm build

WORKDIR /app/pump-engine
CMD ["node", "dist/index.js"]
