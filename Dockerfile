# Multi-stage build optimized for low memory usage
FROM node:20-bookworm-slim AS base

# Set up a reliable Debian mirror
RUN echo "deb http://httpredir.debian.org/debian bookworm main" > /etc/apt/sources.list && \
    echo "deb http://httpredir.debian.org/debian bookworm-updates main" >> /etc/apt/sources.list && \
    echo "deb http://security.debian.org/debian-security bookworm-security main" >> /etc/apt/sources.list

# Install only essential system dependencies
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

# Stage for Python dependencies with memory optimization
FROM base AS py-deps

WORKDIR /app

# Create virtual environment and install Python packages with memory constraints
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

# Set memory-constrained pip options
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

# Install minimal PyTorch CPU with reduced memory footprint
RUN pip install --upgrade pip --timeout=600 --retries=5 && \
    pip install --timeout=600 --retries=5 --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu && \
    pip install --timeout=600 --retries=5 --no-cache-dir opencv-python-headless numpy && \
    pip install --timeout=600 --retries=5 --no-cache-dir easyocr

# Pre-download only English model to save memory
RUN mkdir -p /root/.EasyOCR && \
    python3 - <<'PY'
import os
import easyocr
import gc

# Ensure EasyOCR will write models to this path
os.environ["EASYOCR_MODULE_PATH"] = "/root/.EasyOCR"
print("Downloading minimal EasyOCR model...")
try:
    # Only download English model to minimize memory usage
    reader = easyocr.Reader(["en"], gpu=False, download_enabled=True, verbose=False)
    print("✅ EasyOCR English model downloaded successfully")
    
    # Force cleanup
    del reader
    gc.collect()
    print("✅ Memory cleanup completed")
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

RUN npx puppeteer browsers install chrome

# Copy the rest of the application code
COPY . .
# Build the Next.js app with standalone output
RUN npm run build

# Runtime stage for production with memory optimization
FROM base AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PATH="/venv/bin:$PATH"

# Critical environment variables for memory optimization
ENV PYTHONUNBUFFERED=1
ENV EASYOCR_MODULE_PATH=/root/.EasyOCR
ENV OMP_NUM_THREADS=1
ENV MKL_NUM_THREADS=1
ENV OPENBLAS_NUM_THREADS=1
ENV NUMBA_CACHE_DIR=/tmp/numba_cache
ENV TORCH_NUM_THREADS=1
ENV PYTORCH_TRANSFORMERS_CACHE=/tmp/transformers

# Memory optimization for Node.js
ENV NODE_OPTIONS="--max-old-space-size=200"

# Python memory optimization
ENV PYTHONDONTWRITEBYTECODE=1
ENV MALLOC_TRIM_THRESHOLD_=10000

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
# Create optimized temp directories
RUN mkdir -p /tmp/numba_cache /tmp/transformers /tmp/ocr_temp && \
    chmod 777 /tmp/numba_cache /tmp/transformers /tmp/ocr_temp

# Expose the port
ENV HOSTNAME=0.0.0.0
ENV PORT=8080
EXPOSE 8080

# Health check with memory awareness
HEALTHCHECK --interval=60s --timeout=30s --start-period=120s --retries=2 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Run the Next.js standalone server
CMD ["node", "server.js"]