FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json .
COPY turbo.json .

COPY apps/backend ./apps/backend

RUN bun install --frozen-lockfile

RUN cd apps/backend && bun run build

FROM oven/bun:1-slim AS runner

WORKDIR /app

COPY --from=builder /app/apps/backend/package.json ./package.json
COPY --from=builder /app/apps/backend/dist ./dist

# Install production dependencies only
RUN bun install --production --frozen-lockfile

COPY apps/backend/.env* ./
ENV PORT=3002

EXPOSE 3002

CMD ["bun", "run", "dist/index.js"]
