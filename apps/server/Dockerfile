# ----------------------
# 1. Base image
# ----------------------
FROM node:lts-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ----------------------
# 2. Builder: prune monorepo
# ----------------------
FROM base AS builder
RUN npm install -g pnpm turbo@^2
COPY . .
RUN turbo prune server --docker

# ----------------------
# 3. Installer: install dependencies & build
# ----------------------
FROM base AS installer
WORKDIR /app
RUN npm install -g pnpm

# Copy pruned workspace (sources + package.json files)
COPY --from=builder /app/out/full/ ./
COPY --from=builder /app/out/json/ ./

RUN pnpm install --frozen-lockfile
RUN pnpm build

# ----------------------
# 4. Production runner: flat node_modules
# ----------------------
FROM node:lts-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm

# Copy pruned package.json files & workspace config BEFORE install
COPY --from=builder /app/out/json/ ./

# Install only production dependencies (flat layout to avoid symlinks)
RUN pnpm install --prod --frozen-lockfile --shamefully-hoist

# Copy compiled JS output only (no TS sources)
COPY --from=installer /app/apps/server/dist ./apps/server/dist
COPY --from=installer /app/packages/models/dist ./packages/models/dist

EXPOSE 8080
CMD ["node", "apps/server/dist/index.js"]
