# Base image with Node.js 20 and Debian slim
FROM node:20-bookworm-slim AS base

# Set up a reliable Debian mirror
RUN echo "deb http://httpredir.debian.org/debian bookworm main" > /etc/apt/sources.list && \
    echo "deb http://httpredir.debian.org/debian bookworm-updates main" >> /etc/apt/sources.list && \
    echo "deb http://security.debian.org/debian-security bookworm-security main" >> /etc/apt/sources.list

# Install system dependencies in smaller layers for better debugging and caching
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-dev \
    python3-venv \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

RUN apt-get update && apt-get install -y --no-install-recommends --fix-missing \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgl1-mesa-glx \
    libxshmfence1 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

RUN apt-get update && apt-get install -y --no-install-recommends --fix-missing \
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
    gnupg \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Stage for installing Python dependencies
FROM base AS py-deps

WORKDIR /app

# Install Python dependencies in a virtual environment
RUN python3 -m venv /venv \
    && /venv/bin/pip install --upgrade pip \
    && /venv/bin/pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu \
    && /venv/bin/pip install easyocr \
    && /venv/bin/pip install opencv-python-headless \
    && /venv/bin/pip install numpy

# Stage for Node.js production dependencies
FROM base AS deps

WORKDIR /app

# Copy package files and install production Node.js dependencies, ignoring scripts
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm install --no-save typescript

# Builder stage for installing all dependencies, building the app, and installing Chrome
FROM base AS builder

WORKDIR /app

# Copy package files and install all dependencies (including dev), ignoring scripts
COPY package*.json ./
RUN npm ci --ignore-scripts

# Install Chrome for Puppeteer
RUN npx puppeteer browsers install chrome

# Copy the rest of the application code and build the Next.js app
COPY . .
RUN npm run build

# Runtime stage for production
FROM base AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Activate virtual environment in runtime
ENV PATH="/venv/bin:$PATH"

# Copy Python virtual environment from py-deps
COPY --from=py-deps /venv /venv

# Copy production node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy built Next.js artifacts and necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Copy the Puppeteer Chrome installation cache
COPY --from=builder /root/.cache/puppeteer /root/.cache/puppeteer

# Expose the port Next.js runs on
EXPOSE 3000

# Run the Next.js app
CMD ["npm", "start"]