FROM node:20-bookworm-slim AS base

# Combine apt update/install for layer efficiency
RUN echo "deb http://httpredir.debian.org/debian bookworm main" > /etc/apt/sources.list && \
    echo "deb http://httpredir.debian.org/debian bookworm-updates main" >> /etc/apt/sources.list && \
    echo "deb http://security.debian.org/debian-security bookworm-security main" >> /etc/apt/sources.list && \
    apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgl1-mesa-glx \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Prod-only for cacheable layer
RUN npm ci --omit=dev --ignore-scripts

FROM base AS builder
WORKDIR /app
# Reuse cached prod node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./
# Install full deps for build tools (e.g., puppeteer)
RUN npm ci --ignore-scripts
RUN npx puppeteer browsers install chrome

COPY . .
RUN npm run build

FROM base AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=312"

# Copy prod node_modules (from deps for leanness)
COPY --from=deps /app/node_modules ./node_modules

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/scripts ./scripts

COPY --from=builder /root/.cache/puppeteer /root/.cache/puppeteer

RUN mkdir -p /tmp/ocr_temp && chmod 777 /tmp/ocr_temp

ENV HOSTNAME=0.0.0.0
ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=60s --timeout=30s --start-period=120s --retries=2 \
    CMD curl -f http://localhost:8080/api/health || exit 1

CMD ["node", "server.js"]