# ──────────────────────────────────────────────
# Stage 1: Install dependencies
# ──────────────────────────────────────────────
FROM node:18-alpine AS deps

WORKDIR /app

# Copy only package files first (layer caching — avoids reinstalling
# node_modules every time source code changes)
COPY package*.json ./
RUN npm install --omit=dev

# ──────────────────────────────────────────────
# Stage 2: Final lightweight runtime image
# ──────────────────────────────────────────────
FROM node:18-alpine

WORKDIR /app

# Copy installed modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY app.js .

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

# Healthcheck so Kubernetes knows when the pod is ready
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "app.js"]
