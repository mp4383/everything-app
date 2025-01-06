# Build stage
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl

# Create app directory
WORKDIR /app

# Install global dependencies
RUN npm install -g \
    typescript \
    prisma

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

# Install production dependencies
RUN apk add --no-cache \
    curl \
    # Required for node-gyp
    python3 \
    make \
    g++

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Add production scripts
COPY docker/production/scripts/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port
EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

# Set production environment
ENV NODE_ENV=production

# Use production entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Start application
CMD ["node", "dist/index.js"]

# Add labels
LABEL maintainer="your-email@example.com"
LABEL version="1.0"
LABEL description="Production image for Everything App backend services"
LABEL org.opencontainers.image.source="https://github.com/username/everything-app"
