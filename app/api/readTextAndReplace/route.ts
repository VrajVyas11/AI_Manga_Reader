/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import RapidOCRWrapper from "../../../scripts/index";

// Interfaces for OCR response
export interface OCRResult {
  bbox: number[][];
  text: string;
  confidence: number;
}

export interface Paragraph {
  text: string;
  bbox: number[][];
  score: number;
  item_count: number;
  individual_items: {
    bbox: number[][];
    text: string;
    score: number;
  }[];
}

export interface ProcessedImage {
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

export interface ResponsePayloadSuccess {
  status: "success";
  data: OCRResult[];
  paragraphs: Paragraph[];
  stats: {
    total_lines: number;
    total_paragraphs: number;
    processing_time: string;
    image_size: number;
  };
  memory_usage: {
    before: number;
    beforeOCR: number;
    afterOCR: number;
  };
  metadata: {
    processingTime: number;
    ocrTime: number;
    imageProcessing: ProcessedImage["metadata"];
    requestId: string;
    textCount: number;
  };
}

export interface ResponsePayloadError {
  status: "error";
  error: string;
  code?: string;
  requestId?: string;
}

// Memory settings
const MEMORY_SETTINGS = {
  maxImageSize: 1.5 * 1024 * 1024,
  maxProcessedWidth: 800,
  maxProcessedHeight: 800,
  jpegQuality: 60,
  ocrTimeout: 45000,
  memoryCheckThreshold: 1500,
  forceCleanupThreshold: 1500
} as const;

// Global OCR instance
let globalOCR: RapidOCRWrapper | null = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
    external: Math.round(usage.external / 1024 / 1024),
    rss: Math.round(usage.rss / 1024 / 1024)
  };
}

function forceMemoryCleanup() {
  if (global.gc) {
    global.gc();
  }
}

async function initializeOCR(): Promise<void> {
  if (globalOCR) return;

  console.log("Initializing OCR...");
  const memBefore = getMemoryUsage();
  
  globalOCR = new RapidOCRWrapper();
  await globalOCR.init("en");

  const memAfter = getMemoryUsage();
  console.log(`OCR initialized: ${memBefore.rss}MB -> ${memAfter.rss}MB`);
}

async function getOCRInstance(): Promise<RapidOCRWrapper> {
  if (!globalOCR) {
    if (!isInitializing) {
      isInitializing = true;
      initPromise = initializeOCR();
      await initPromise;
      isInitializing = false;
    } else if (initPromise) {
      await initPromise;
    }
  }

  if (!globalOCR) {
    throw new Error("OCR initialization failed");
  }

  return globalOCR;
}

async function preprocessImage(inputBuffer: Buffer): Promise<ProcessedImage> {
  const start = Date.now();

  const meta = await sharp(inputBuffer, {
    limitInputPixels: 4194304,
    sequentialRead: true,
  }).metadata();

  if (!meta.width || !meta.height) throw new Error("Invalid image metadata");

  let width = Math.floor(meta.width);
  let height = Math.floor(meta.height);

  const maxDim = Math.min(MEMORY_SETTINGS.maxProcessedWidth, MEMORY_SETTINGS.maxProcessedHeight);
  const scaleFactor = Math.min(maxDim / width, maxDim / height, 0.5);

  width = Math.floor(width * scaleFactor);
  height = Math.floor(height * scaleFactor);

  if (width < 200) width = 200;
  if (height < 200) height = 200;

  const processedBuffer = await sharp(inputBuffer, {
    limitInputPixels: 4194304,
    sequentialRead: true
  })
    .resize(width, height, { kernel: sharp.kernel.nearest, withoutEnlargement: true })
    .normalize()
    .jpeg({ quality: MEMORY_SETTINGS.jpegQuality, progressive: false, mozjpeg: false, chromaSubsampling: "4:2:0" })
    .toBuffer();

  const uploadDir = "/tmp";
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const imagePath = path.join(uploadDir, `ocr_${Date.now()}.jpg`);
  fs.writeFileSync(imagePath, processedBuffer);

  const processingTime = Date.now() - start;
  const compressionRatio = Math.round((1 - processedBuffer.length / inputBuffer.length) * 100);

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
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();
  let imagePath: string | null = null;

  try {
    const memoryBefore = getMemoryUsage();
    if (memoryBefore.rss > MEMORY_SETTINGS.memoryCheckThreshold) {
      return NextResponse.json<ResponsePayloadError>({
        status: "error",
        error: "Server memory limit exceeded. Please try again in a few minutes.",
        code: "MEMORY_LIMIT_EXCEEDED"
      }, { status: 503 });
    }

    const formData = await req.formData();
    const fileField = formData.get("file");
    
    if (!fileField || !(fileField instanceof Blob)) {
      return NextResponse.json<ResponsePayloadError>({ 
        status: "error", 
        error: "No valid file provided" 
      }, { status: 400 });
    }

    const uploadedFile = fileField as File;
    if (!uploadedFile.type?.startsWith?.("image/")) {
      return NextResponse.json<ResponsePayloadError>({ 
        status: "error", 
        error: "Please upload an image file" 
      }, { status: 400 });
    }

    if (uploadedFile.size > MEMORY_SETTINGS.maxImageSize) {
      return NextResponse.json<ResponsePayloadError>({
        status: "error",
        error: `File too large. Maximum size is ${Math.round(MEMORY_SETTINGS.maxImageSize / 1024 / 1024)}MB`
      }, { status: 400 });
    }

    const buffer = Buffer.from(await uploadedFile.arrayBuffer());
    const memoryAfterLoad = getMemoryUsage();
    
    if (memoryAfterLoad.rss > MEMORY_SETTINGS.memoryCheckThreshold) {
      return NextResponse.json<ResponsePayloadError>({ 
        status: "error", 
        error: "Insufficient memory after file load" 
      }, { status: 503 });
    }

    let processedImage: ProcessedImage;
    try {
      processedImage = await preprocessImage(buffer);
      imagePath = processedImage.path;
    } catch (e) {
      return NextResponse.json<ResponsePayloadError>({ 
        status: "error", 
        error: "Failed to process image. Try a smaller image." 
      }, { status: 500 });
    }

    forceMemoryCleanup();
    const memoryBeforeOCR = getMemoryUsage();
    
    if (memoryBeforeOCR.rss > MEMORY_SETTINGS.memoryCheckThreshold) {
      return NextResponse.json<ResponsePayloadError>({ 
        status: "error", 
        error: "Insufficient memory for OCR processing" 
      }, { status: 503 });
    }

    try {
      const ocrInstance = await getOCRInstance();
      const ocrStart = Date.now();
      const ocrResult = await ocrInstance.readText(imagePath);
      const ocrDuration = Date.now() - ocrStart;

      forceMemoryCleanup();
      const memoryAfterOCR = getMemoryUsage();

      const totalDuration = Date.now() - startTime;

      const successPayload: ResponsePayloadSuccess = {
        status: "success",
        data: ocrResult.data || [],
        paragraphs: ocrResult.paragraphs || [],
        stats: {
          total_lines: ocrResult.data?.length || 0,
          total_paragraphs: ocrResult.paragraphs?.length || 0,
          processing_time: `${(totalDuration / 1000).toFixed(3)}s`,
          image_size: processedImage.metadata.originalSize
        },
        memory_usage: { 
          before: memoryBefore.rss, 
          beforeOCR: memoryBeforeOCR.rss, 
          afterOCR: memoryAfterOCR.rss 
        },
        metadata: {
          processingTime: totalDuration,
          ocrTime: ocrDuration,
          imageProcessing: processedImage.metadata,
          requestId,
          textCount: ocrResult.data?.length || 0
        }
      };

      return NextResponse.json(successPayload);
    } catch (ocrError) {
      const msg = (ocrError as Error).message ?? "OCR processing failed";
      if (msg.includes("timeout")) {
        return NextResponse.json<ResponsePayloadError>({ 
          status: "error", 
          error: "OCR timed out. Try a smaller/clearer image.",
          requestId 
        }, { status: 500 });
      }
      return NextResponse.json<ResponsePayloadError>({ 
        status: "error", 
        error: "OCR processing failed",
        requestId 
      }, { status: 500 });
    }
  } catch (err) {
    const message = (err as Error).message ?? "Server error occurred";
    return NextResponse.json<ResponsePayloadError>({ 
      status: "error", 
      error: message,
      requestId 
    }, { status: 500 });
  } finally {
    if (imagePath && fs.existsSync(imagePath)) {
      try { fs.unlinkSync(imagePath); } catch (_) { /* ignore */ }
    }
    forceMemoryCleanup();
  }
}