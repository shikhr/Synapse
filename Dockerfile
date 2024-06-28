# Build stage
FROM node:lts-bullseye AS builder

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies including dev dependencies
RUN npm run postinstall

COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:current-alpine

WORKDIR /app

# Copy only the server's package files
COPY server/package*.json ./server/

# Install only the server's production dependencies
RUN cd server && npm install --omit=dev

# Copy built assets from builder stage
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 5000

# Adjust the start command to run from the server directory
CMD ["node", "server/dist/server.js"]