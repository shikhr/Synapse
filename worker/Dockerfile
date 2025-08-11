FROM node:lts-bullseye AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

FROM node:current-alpine
WORKDIR /app
COPY --from=deps /app/package*.json ./
RUN npm install --omit=dev
COPY --from=deps /app/dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
