FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json .
COPY turbo.json .

COPY apps/server ./apps/server

RUN bun install --frozen-lockfile

RUN cd apps/server && bun run build

FROM oven/bun:1-slim AS runner

WORKDIR /app

COPY --from=builder /app/apps/server/package.json ./package.json
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/node_modules ./node_modules

COPY apps/server/.env* ./

EXPOSE 3001

CMD ["bun", "run", "dist/index.js"]
