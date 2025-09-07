# Base image with Node.js 20 and Debian slim for compatibility with Next.js 15 and Puppeteer/Chrome
FROM node:20-bookworm-slim AS base

# Install system dependencies for Python, pip, and Puppeteer/Chrome
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
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
    libglib2.0-0 \
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
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Builder stage for installing dependencies, building the app, and installing Chrome
FROM base AS builder

WORKDIR /app

# Copy package files and install all dependencies (including dev for build)
COPY package*.json ./
RUN npm install

# Install Chrome for Puppeteer using the specified command
RUN npx puppeteer browsers install chrome

# Copy the rest of the application code and build the Next.js 15 app
COPY . .
RUN npm run build

# Runtime stage for production, copying necessary artifacts (reuse node_modules from builder)
FROM base AS runtime

WORKDIR /app
ENV NODE_ENV=production

# Copy package files (optional) and reuse node_modules from builder to avoid problematic postinstall scripts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy built Next.js 15 artifacts and public files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Copy the Puppeteer Chrome installation cache
COPY --from=builder /root/.cache/puppeteer /root/.cache/puppeteer

# Expose the port Next.js runs on
EXPOSE 3000

# Run the Next.js 15 app
CMD ["npm", "start"]