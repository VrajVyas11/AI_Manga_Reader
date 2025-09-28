/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import EasyOCRWrapper from "easyocr-js";

// Types
interface OCRResult {
  bbox: number[][];
  text: string;
  confidence: number;
}

interface OCRResponse {
  data: OCRResult[];
}

interface ProcessedImage {
  buffer: Buffer;
  path: string;
  metadata: {
    originalSize: number;
    processedSize: number;
    dimensions: { width: number; height: number };
    processingTime: number;
    compressionRatio: number;
  };
}

interface MemoryUsage {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
}

// Global state with proper typing
let globalOCR: EasyOCRWrapper | null = null;
let isInitializing: boolean = false;
let initPromise: Promise<void> | null = null;
let lastUsed: number = Date.now();
// Ultra-aggressive settings for 512MB RAM
const MEMORY_SETTINGS = {
  maxImageSize: 1.5 * 1024 * 1024, // 1.5MB max
  maxProcessedWidth: 800,           // Very small resolution
  maxProcessedHeight: 800,          // Very small resolution
  jpegQuality: 60,                  // Lower quality
  pngCompressionLevel: 9,           // Max compression
  maxConcurrent: 1,                 // Single processing
  ocrTimeout: 30000,                // 30 second timeout
  cleanupInterval: 60000,           // Cleanup every minute
  memoryCheckThreshold: 250,        // Reduced from 200
  forceCleanupThreshold: 250       // Force cleanup at 250MB
} as const;

// Memory monitoring with proper typing
function getMemoryUsage(): MemoryUsage {
  const usage = process.memoryUsage();
  return {
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
    external: Math.round(usage.external / 1024 / 1024),
    rss: Math.round(usage.rss / 1024 / 1024)
  };
}

// Aggressive memory cleanup
function forceMemoryCleanup(): void {
  try {
    const memBefore = getMemoryUsage();

    // Multiple garbage collections
    if (global.gc) {
      for (let i = 0; i < 5; i++) {
        global.gc();
      }
    }

    const memAfter = getMemoryUsage();
    const saved = memBefore.rss - memAfter.rss;
    if (saved > 0) {
      console.log(`Memory freed: ${saved}MB (${memAfter.rss}MB remaining)`);
    }
  } catch (error) {
    console.warn("Memory cleanup warning:", (error as Error).message);
  }
}

// Ultra-conservative memory pressure check
function checkMemoryPressure(): boolean {
  const memUsage = getMemoryUsage();

  // Much more aggressive thresholds
  if (memUsage.rss > MEMORY_SETTINGS.memoryCheckThreshold) {
    console.warn(`Memory pressure: ${memUsage.rss}MB RSS (limit: ${MEMORY_SETTINGS.memoryCheckThreshold}MB)`);
    forceMemoryCleanup();

    const memAfterCleanup = getMemoryUsage();
    if (memAfterCleanup.rss > MEMORY_SETTINGS.forceCleanupThreshold) {
      console.warn("Forcing OCR instance closure due to memory pressure");
      closeOCRInstance();
      return true;
    }
  }

  return false;
}

// Close OCR instance
function closeOCRInstance(): void {
  if (globalOCR) {
    try {
      // Don't await here to avoid blocking
      globalOCR.close().catch((err) =>
        console.error("OCR close error:", (err as Error).message)
      );
      console.log("OCR instance closed");
    } catch (error) {
      console.error("Error closing OCR:", (error as Error).message);
    }
    globalOCR = null;
  }
  isInitializing = false;
  initPromise = null;

  // Force cleanup after closing
  forceMemoryCleanup();
}

// Initialize OCR with memory checks
async function getOCRInstance(): Promise<EasyOCRWrapper> {
  // Pre-check memory
  if (checkMemoryPressure()) {
    throw new Error("Insufficient memory for OCR initialization");
  }

  if (globalOCR) {
    lastUsed = Date.now();
    return globalOCR;
  }

  if (isInitializing && initPromise) {
    await initPromise;
    if (globalOCR) {
      lastUsed = Date.now();
      return globalOCR;
    }
  }

  if (!isInitializing) {
    isInitializing = true;
    initPromise = initializeOCR();
    await initPromise;
    isInitializing = false;
  }

  if (!globalOCR) {
    throw new Error("OCR initialization failed - memory constraints");
  }

  lastUsed = Date.now();
  return globalOCR;
}

async function initializeOCR(): Promise<void> {
  try {
    console.log("Initializing OCR...");
    const startTime = Date.now();
    const memBefore = getMemoryUsage();

    // Cleanup before init
    forceMemoryCleanup();

    globalOCR = new EasyOCRWrapper();
    await globalOCR.init("en");

    const duration = Date.now() - startTime;
    const memAfter = getMemoryUsage();
    console.log(`OCR ready in ${duration}ms - Memory: ${memBefore.rss}MB -> ${memAfter.rss}MB`);

  } catch (error) {
    console.error("OCR init failed:", (error as Error).message);
    globalOCR = null;
    throw error;
  }
}

// Ultra-aggressive image preprocessing
async function preprocessImage(inputBuffer: Buffer, originalName: string): Promise<ProcessedImage> {
  try {
    const startTime = Date.now();
    console.log(`Processing: ${originalName} (${Math.round(inputBuffer.length / 1024)}KB)`);

    // Check memory before processing
    if (checkMemoryPressure()) {
      throw new Error("Insufficient memory for image processing");
    }

    // Get minimal metadata
    const metadata = await sharp(inputBuffer, {
      limitInputPixels: 4194304, // Much smaller limit (2048x2048)
      sequentialRead: true,
      density: 72
    }).metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("Invalid image metadata");
    }

    console.log(`Original: ${metadata.width}x${metadata.height}`);

    // Ultra-aggressive resizing
    let { width, height } = metadata;
    const maxDim = Math.min(MEMORY_SETTINGS.maxProcessedWidth, MEMORY_SETTINGS.maxProcessedHeight);

    // Force downscale regardless of original size
    const scaleFactor = Math.min(
      maxDim / width,
      maxDim / height,
      0.5 // Never exceed 50% of original
    );

    width = Math.floor(width * scaleFactor);
    height = Math.floor(height * scaleFactor);

    // Ensure minimum readable size
    if (width < 200 || height < 200) {
      width = Math.max(width, 200);
      height = Math.max(height, 200);
    }

    console.log(`Resizing to: ${width}x${height}`);

    // Process with minimal settings
    const processedBuffer = await sharp(inputBuffer, {
      limitInputPixels: 4194304,
      sequentialRead: true
    })
      .resize(width, height, {
        kernel: sharp.kernel.nearest, // Fastest kernel
        withoutEnlargement: true
      })
      // Minimal processing for speed and memory
      .normalize()
      .jpeg({
        quality: MEMORY_SETTINGS.jpegQuality,
        progressive: false,
        mozjpeg: false, // Disable for speed
        chromaSubsampling: '4:2:0' // Reduce file size
      })
      .toBuffer();

    // Immediate cleanup
    forceMemoryCleanup();

    // Save to temp
    const uploadDir = "/tmp";
    const imagePath = path.join(
      uploadDir,
      `ocr_${Date.now()}.jpg`
    );

    fs.writeFileSync(imagePath, processedBuffer);

    const processingTime = Date.now() - startTime;
    const compressionRatio = Math.round((1 - processedBuffer.length / inputBuffer.length) * 100);

    console.log(`Processed in ${processingTime}ms: ${compressionRatio}% smaller`);

    return {
      buffer: processedBuffer,
      path: imagePath,
      metadata: {
        originalSize: inputBuffer.length,
        processedSize: processedBuffer.length,
        dimensions: { width, height },
        processingTime,
        compressionRatio
      }
    };

  } catch (error) {
    forceMemoryCleanup();
    throw new Error(`Image processing failed: ${(error as Error).message}`);
  }
}

// Auto-cleanup with shorter intervals
// eslint-disable-next-line no-undef
let cleanupTimer: NodeJS.Timeout;

function startCleanupTimer(): void {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
  }

  cleanupTimer = setInterval(() => {
    const timeSinceLastUse = Date.now() - lastUsed;
    const memUsage = getMemoryUsage();

    // Much more aggressive cleanup
    if (timeSinceLastUse > MEMORY_SETTINGS.cleanupInterval || memUsage.rss > MEMORY_SETTINGS.forceCleanupThreshold) {
      console.log("Auto-cleanup triggered");
      closeOCRInstance();
      forceMemoryCleanup();

      // Clean temp files
      try {
        const tempFiles = fs.readdirSync("/tmp").filter(f => f.startsWith("ocr_"));
        tempFiles.forEach(file => {
          const filePath = path.join("/tmp", file);
          fs.unlinkSync(filePath);
        });
        if (tempFiles.length > 0) {
          console.log(`Cleaned ${tempFiles.length} temp files`);
        }
      } catch (error: unknown) {
        // Ignore cleanup errors
      }
    }
  }, 30000); // Check every 30 seconds
}

startCleanupTimer();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down...");
  if (cleanupTimer) clearInterval(cleanupTimer);
  closeOCRInstance();
  process.exit(0);
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();
  let imagePath: string | null = null;

  try {
    console.log(`[${requestId}] OCR request started`);
    const memoryBefore = getMemoryUsage();
    console.log(`[${requestId}] Memory: ${memoryBefore.rss}MB RSS`);

    // Immediate memory check - fail fast if over limit
    if (memoryBefore.rss > MEMORY_SETTINGS.forceCleanupThreshold) {
      console.log(`[${requestId}] Memory limit exceeded before processing`);
      return NextResponse.json({
        status: "error",
        error: "Server memory limit exceeded. Please try again in a few minutes.",
        code: "MEMORY_LIMIT_EXCEEDED",
        text: { data: [] }
      }, { status: 503 });
    }

    // Parse form with timeout
    const formData = await Promise.race([
      req.formData(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Form parsing timeout")), 10000)
      )
    ]);

    const file = formData.get("file") as File | null;

    // Quick validations
    if (!file) {
      return NextResponse.json({
        status: "error",
        error: "No file provided",
        code: "NO_FILE",
        text: { data: [] }
      }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({
        status: "error",
        error: "Please upload an image file",
        code: "INVALID_FILE_TYPE",
        text: { data: [] }
      }, { status: 400 });
    }

    if (file.size > MEMORY_SETTINGS.maxImageSize) {
      return NextResponse.json({
        status: "error",
        error: `File too large. Maximum size is ${Math.round(MEMORY_SETTINGS.maxImageSize / 1024 / 1024)}MB`,
        code: "FILE_TOO_LARGE",
        text: { data: [] }
      }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({
        status: "error",
        error: "Empty file provided",
        code: "EMPTY_FILE",
        text: { data: [] }
      }, { status: 400 });
    }

    // Convert to buffer with memory check
    const buffer = Buffer.from(await file.arrayBuffer());
    const memoryAfterLoad = getMemoryUsage();

    if (memoryAfterLoad.rss > MEMORY_SETTINGS.memoryCheckThreshold) {
      return NextResponse.json({
        status: "error",
        error: "Insufficient memory after file load",
        code: "MEMORY_INSUFFICIENT",
        text: { data: [] }
      }, { status: 503 });
    }

    console.log(`[${requestId}] File loaded: ${Math.round(buffer.length / 1024)}KB`);

    // Preprocess image
    let processedImage: ProcessedImage;
    try {
      processedImage = await preprocessImage(buffer, file.name);
      imagePath = processedImage.path;
    } catch (preprocessError) {
      console.error(`[${requestId}] Preprocessing failed:`, (preprocessError as Error).message);
      return NextResponse.json({
        status: "error",
        error: "Failed to process image. Try a smaller image.",
        code: "PREPROCESSING_FAILED",
        text: { data: [] }
      }, { status: 500 });
    }

    // Force cleanup before OCR
    forceMemoryCleanup();

    const memoryBeforeOCR = getMemoryUsage();
    console.log(`[${requestId}] Memory before OCR: ${memoryBeforeOCR.rss}MB`);

    // Final memory check before OCR
    if (memoryBeforeOCR.rss > MEMORY_SETTINGS.memoryCheckThreshold) {
      return NextResponse.json({
        status: "error",
        error: "Insufficient memory for OCR processing",
        code: "OCR_MEMORY_INSUFFICIENT",
        text: { data: [] }
      }, { status: 503 });
    }

    // OCR processing with aggressive timeout
    try {
      console.log(`[${requestId}] Starting OCR...`);
      const ocr = await getOCRInstance();

      const ocrPromise = ocr.readText(imagePath);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("OCR timeout")), MEMORY_SETTINGS.ocrTimeout)
      );

      const ocrStartTime = Date.now();
      const result = await Promise.race([ocrPromise, timeoutPromise]) as unknown as OCRResponse;
      const ocrDuration = Date.now() - ocrStartTime;

      console.log(`[${requestId}] OCR completed in ${ocrDuration}ms`);

      // Immediate cleanup after OCR
      forceMemoryCleanup();

      const memoryAfterOCR = getMemoryUsage();
      console.log(`[${requestId}] Memory after OCR: ${memoryAfterOCR.rss}MB`);

      // Validate results
      if (!result?.data || !Array.isArray(result.data)) {
        return NextResponse.json({
          status: "success",
          text: { data: [] },
          message: "No text found in image",
          metadata: {
            processingTime: Date.now() - startTime,
            ocrTime: ocrDuration,
            requestId
          }
        });
      }

      // Filter valid results
      const validResults = result.data.filter((item): item is OCRResult =>
        Boolean(item?.text && typeof item.text === 'string' && item.text.trim().length > 0)
      );

      if (validResults.length === 0) {
        return NextResponse.json({
          status: "success",
          text: { data: [] },
          message: "No readable text found",
          metadata: {
            processingTime: Date.now() - startTime,
            ocrTime: ocrDuration,
            imageProcessing: processedImage.metadata,
            requestId
          }
        });
      }

      const totalDuration = Date.now() - startTime;
      console.log(`[${requestId}] Success: ${validResults.length} text items in ${totalDuration}ms`);

      return NextResponse.json({
        status: "success",
        text: { data: validResults },
        metadata: {
          processingTime: totalDuration,
          ocrTime: ocrDuration,
          imageProcessing: processedImage.metadata,
          memoryUsage: {
            before: memoryBefore.rss,
            beforeOCR: memoryBeforeOCR.rss,
            afterOCR: memoryAfterOCR.rss
          },
          requestId,
          textCount: validResults.length
        }
      });

    } catch (ocrError) {
      console.error(`[${requestId}] OCR error:`, (ocrError as Error).message);

      let errorCode = "OCR_FAILED";
      let userMessage = "OCR processing failed";

      if ((ocrError as Error).message.includes("timeout")) {
        errorCode = "OCR_TIMEOUT";
        userMessage = "OCR timed out. Try a smaller/clearer image.";
        closeOCRInstance(); // Reset on timeout
      } else if ((ocrError as Error).message.includes("memory")) {
        errorCode = "OCR_MEMORY_ERROR";
        userMessage = "OCR memory error. Try a much smaller image.";
        closeOCRInstance(); // Reset on memory error
      }

      return NextResponse.json({
        status: "error",
        error: userMessage,
        code: errorCode,
        text: { data: [] },
        requestId
      }, { status: 500 });
    }

  } catch (error) {
    console.error(`[${requestId}] Server error:`, (error as Error).message);

    let errorCode = "SERVER_ERROR";
    let userMessage = "Server error occurred";

    if ((error as Error).message.includes("memory")) {
      errorCode = "MEMORY_ERROR";
      userMessage = "Server memory exceeded. Try again later.";
    } else if ((error as Error).message.includes("timeout")) {
      errorCode = "TIMEOUT_ERROR";
      userMessage = "Request timed out.";
    }

    return NextResponse.json({
      status: "error",
      error: userMessage,
      code: errorCode,
      text: { data: [] },
      requestId
    }, { status: 500 });

  } finally {
    // Cleanup temp file
    if (imagePath && fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        console.log(`[${requestId}] Cleaned up temp file`);
      } catch (error) {
        console.error(`[${requestId}] Cleanup failed:`, (error as Error).message);
      }
    }

    // Force final cleanup
    forceMemoryCleanup();

    const totalTime = Date.now() - startTime;
    const finalMemory = getMemoryUsage();
    console.log(`[${requestId}] Completed in ${totalTime}ms - Final memory: ${finalMemory.rss}MB`);

    // If memory is still high after cleanup, close OCR
    if (finalMemory.rss > MEMORY_SETTINGS.memoryCheckThreshold) {
      console.log(`[${requestId}] High memory detected, closing OCR instance`);
      closeOCRInstance();
    }
  }
}