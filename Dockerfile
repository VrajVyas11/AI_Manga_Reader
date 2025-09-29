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
    python3-venv \
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

# Stage for Python dependencies with memory optimization
FROM base AS py-deps

WORKDIR /app

# Create virtual environment and install Python packages with memory constraints
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

# Set memory-constrained pip options
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

# First install base dependencies
RUN pip install --upgrade pip --timeout=600 --retries=5

# Install system packages first
RUN pip install --timeout=600 --retries=5 --no-cache-dir \
    psutil

# Install numpy first (base for many scientific packages)
RUN pip install --timeout=600 --retries=5 --no-cache-dir \
    "numpy>=1.21.0"

# Install Pillow and image processing libraries
RUN pip install --timeout=600 --retries=5 --no-cache-dir \
    "Pillow>=9.0.0" \
    "pillow-heif>=0.16.0"

# Install RapidOCR and its dependencies
RUN pip install --timeout=600 --retries=5 --no-cache-dir \
    "rapidocr-onnxruntime>=1.3.7" \
    "onnxruntime>=1.14.0"

# Install text processing libraries
RUN pip install --timeout=600 --retries=5 --no-cache-dir \
    "wordninja>=2.0.0"


# Test ALL imports to ensure everything works (FIXED VERSION)
RUN python3 - <<'PY'
import sys
print("Python version:", sys.version)

# Test basic imports
try:
    import time
    import gc
    import math
    import io
    import json
    import os
    import logging
    from pathlib import Path
    from functools import cmp_to_key
    print("✅ Basic imports successful")
except ImportError as e:
    print(f"❌ Basic import failed: {e}")
    sys.exit(1)

# Test system imports
try:
    import psutil
    print("✅ psutil imported")
except ImportError as e:
    print(f"❌ psutil import failed: {e}")
    sys.exit(1)

# Test numpy
try:
    import numpy as np
    print(f"✅ numpy {np.__version__} imported")
except ImportError as e:
    print(f"❌ numpy import failed: {e}")
    sys.exit(1)

# Test PIL
try:
    from PIL import Image
    print(f"✅ PIL imported")
except ImportError as e:
    print(f"❌ PIL import failed: {e}")
    sys.exit(1)

# Test pillow-heif (FIXED - handle different versions)
try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
    # Try to register AVIF if available
    try:
        from pillow_heif import register_avif_opener
        register_avif_opener()
        print("✅ pillow-heif imported with AVIF support")
    except ImportError:
        print("✅ pillow-heif imported (HEIF only)")
except ImportError as e:
    print(f"❌ pillow-heif import failed: {e}")
    sys.exit(1)

# Test RapidOCR
try:
    from rapidocr_onnxruntime import RapidOCR
    print("✅ RapidOCR imported")
except ImportError as e:
    print(f"❌ RapidOCR import failed: {e}")
    sys.exit(1)

# Test wordninja
try:
    import wordninja
    print("✅ wordninja imported")
except ImportError as e:
    print(f"❌ wordninja import failed: {e}")
    sys.exit(1)

print("🎉 All Python dependencies imported successfully!")
PY

# Test RapidOCR initialization
RUN mkdir -p /root/.cache/rapidocr && \
    python3 - <<'PY'
import os
import gc
import time
import numpy as np
from rapidocr_onnxruntime import RapidOCR

print("Testing RapidOCR initialization...")
try:
    reader = RapidOCR()
    print("✅ RapidOCR initialized successfully")
    
    # Test with a simple operation
    test_image = np.ones((100, 100, 3), dtype=np.uint8) * 255
    
    # Use time measurement instead of relying on elapse from RapidOCR
    start_time = time.time()
    results, elapse = reader(test_image)
    end_time = time.time()
    
    actual_time = end_time - start_time
    print(f"✅ RapidOCR test completed in {actual_time:.3f}s")
    
    # Check if we got any results
    if results is not None:
        print(f"✅ Test returned {len(results)} results")
    else:
        print("✅ Test completed (no results expected for blank image)")
    
    del reader
    gc.collect()
    print("✅ Memory cleanup completed")
except Exception as e:
    print(f"❌ RapidOCR setup failed: {e}")
    raise
PY

# Stage for Node.js production dependencies
FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts

# Builder stage for building the app
FROM base AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Copy the rest of the application code
COPY . .
RUN npm run build

RUN npx puppeteer browsers install chrome

# Runtime stage for production with memory optimization
FROM base AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PATH="/venv/bin:$PATH"

# Critical environment variables for memory optimization
ENV PYTHONUNBUFFERED=1
ENV OMP_NUM_THREADS=1
ENV MKL_NUM_THREADS=1
ENV OPENBLAS_NUM_THREADS=1
ENV NUMBA_CACHE_DIR=/tmp/numba_cache
ENV TORCH_NUM_THREADS=1

# Memory optimization for Node.js
ENV NODE_OPTIONS="--max-old-space-size=312"

# Python memory optimization
ENV PYTHONDONTWRITEBYTECODE=1
ENV MALLOC_TRIM_THRESHOLD_=10000

# Copy Python virtual environment
COPY --from=py-deps /venv /venv
COPY --from=py-deps /root/.cache/rapidocr /root/.cache/rapidocr

# Copy production node_modules
COPY --from=deps /app/node_modules ./node_modules

# Copy standalone output and necessary files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./

# Create optimized temp directories
RUN mkdir -p /tmp/numba_cache /tmp/ocr_temp && \
    chmod 777 /tmp/numba_cache /tmp/ocr_temp
# Expose the port
ENV HOSTNAME=0.0.0.0
ENV PORT=8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=60s --timeout=30s --start-period=120s --retries=2 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Run the Next.js standalone server
CMD ["node", "server.js"]