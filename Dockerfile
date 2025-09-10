# Base image with Node.js 20 and Debian slim
FROM node:20-bookworm-slim AS base

# Set up a reliable Debian mirror
RUN echo "deb http://httpredir.debian.org/debian bookworm main" > /etc/apt/sources.list && \
    echo "deb http://httpredir.debian.org/debian bookworm-updates main" >> /etc/apt/sources.list && \
    echo "deb http://security.debian.org/debian-security bookworm-security main" >> /etc/apt/sources.list

# Install system dependencies in one layer for better caching
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-dev \
    python3-venv \
    build-essential \
    gcc \
    g++ \
    make \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgl1-mesa-glx \
    libxshmfence1 \
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

# Stage for Python dependencies and EasyOCR model pre-download
FROM base AS py-deps

WORKDIR /app

# Create virtual environment and install Python packages
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

# Install Python dependencies with increased timeout and retry
RUN pip install --upgrade pip --timeout=600 --retries=5 && \
    pip install --timeout=600 --retries=5 --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu && \
    pip install --timeout=600 --retries=5 --no-cache-dir opencv-python-headless numpy && \
    pip install --timeout=600 --retries=5 --no-cache-dir easyocr

# Pre-download EasyOCR models during build to avoid runtime downloads
RUN mkdir -p /root/.EasyOCR && \
    python3 - <<'PY'
import os
import easyocr

# Ensure EasyOCR will write models to this path
os.environ["EASYOCR_MODULE_PATH"] = "/root/.EasyOCR"
print("Downloading EasyOCR models...")
try:
    reader = easyocr.Reader(["en"], gpu=False, download_enabled=True)
    print("✅ EasyOCR English models downloaded successfully")
    print("✅ EasyOCR reader test passed")
except Exception as e:
    print("❌ EasyOCR setup failed:", str(e))
    raise
PY

# Stage for Node.js production dependencies
FROM base AS deps

WORKDIR /app

# Copy package files first to leverage caching
COPY package.json package-lock.json* ./
# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts && npm install --no-save typescript

# Builder stage for building the app
FROM base AS builder

WORKDIR /app

# Copy package files and install all dependencies (including dev for build)
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Install Chrome for Puppeteer
RUN npx puppeteer browsers install chrome

# Copy the rest of the application code
COPY . .
# Build the Next.js app with standalone output
RUN npm run build

# Runtime stage for production
FROM base AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PATH="/venv/bin:$PATH"

# Critical environment variables for EasyOCR performance
ENV PYTHONUNBUFFERED=1
ENV EASYOCR_MODULE_PATH=/root/.EasyOCR
ENV OMP_NUM_THREADS=1
ENV MKL_NUM_THREADS=1
ENV NUMBA_CACHE_DIR=/tmp/numba_cache

# Copy Python virtual environment with pre-downloaded models
COPY --from=py-deps /venv /venv
COPY --from=py-deps /root/.EasyOCR /root/.EasyOCR

# Copy production node_modules
COPY --from=deps /app/node_modules ./node_modules

# Copy standalone output and necessary files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Copy the Puppeteer Chrome installation
COPY --from=builder /root/.cache/puppeteer /root/.cache/puppeteer

# Create temp directories for better performance
RUN mkdir -p /tmp/numba_cache && chmod 777 /tmp/numba_cache

# Expose the port
ENV HOSTNAME=0.0.0.0
ENV PORT=8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Run the Next.js standalone server
CMD ["node", "server.js"]