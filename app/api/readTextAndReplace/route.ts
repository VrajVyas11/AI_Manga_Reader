/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import EasyOCRWrapper from "easyocr-js";

// Global OCR instance to avoid repeated initialization
let globalOCR: EasyOCRWrapper | null = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

// Memory management settings
const MEMORY_SETTINGS = {
  maxImageSize: 5 * 1024 * 1024, // 5MB max input
  maxProcessedWidth: 2048,
  maxProcessedHeight: 2048,
  jpegQuality: 85,
  pngCompressionLevel: 6
};

// Initialize OCR instance once and reuse it
async function getOCRInstance(): Promise<EasyOCRWrapper> {
  if (globalOCR) {
    return globalOCR;
  }

  if (isInitializing && initPromise) {
    await initPromise;
    if (globalOCR) return globalOCR;
  }

  if (!isInitializing) {
    isInitializing = true;
    initPromise = initializeOCR();
    await initPromise;
    isInitializing = false;
  }

  if (!globalOCR) {
    throw new Error("Failed to initialize OCR instance");
  }

  return globalOCR;
}

async function initializeOCR(): Promise<void> {
  try {
    console.log("Initializing OCR instance...");
    const startTime = Date.now();
    
    globalOCR = new EasyOCRWrapper();
    await globalOCR.init("en");
    
    const duration = Date.now() - startTime;
    console.log(`OCR initialized successfully in ${duration}ms`);
  } catch (error: any) {
    console.error("OCR initialization failed:", error.message);
    globalOCR = null;
    throw error;
  }
}

// Image preprocessing with Sharp for memory optimization
async function preprocessImage(inputBuffer: Buffer, originalName: string): Promise<{
  buffer: Buffer;
  path: string;
  metadata: any;
}> {
  try {
    const startTime = Date.now();
    console.log(`Preprocessing image: ${originalName} (${inputBuffer.length} bytes)`);
    
    // Get image metadata first
    const metadata = await sharp(inputBuffer).metadata() as {height:number,width:number,format:string};
    console.log(`Original image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);
    
    // Calculate optimal dimensions while preserving aspect ratio
    let { width, height } = metadata;
    const aspectRatio = width / height;
    
    if (width > MEMORY_SETTINGS.maxProcessedWidth || height > MEMORY_SETTINGS.maxProcessedHeight) {
      if (width > height) {
        width = MEMORY_SETTINGS.maxProcessedWidth;
        height = Math.round(width / aspectRatio);
      } else {
        height = MEMORY_SETTINGS.maxProcessedHeight;
        width = Math.round(height * aspectRatio);
      }
      console.log(`Resizing to: ${width}x${height}`);
    }
    
    // Process image with Sharp for OCR optimization
    let sharpInstance = sharp(inputBuffer, {
      limitInputPixels: 268402689, // ~16384x16384 limit
      sequentialRead: true
    });
    
    // Apply preprocessing optimizations
    sharpInstance = sharpInstance
      .resize(width, height, {
        kernel: sharp.kernel.lanczos3,
        withoutEnlargement: true
      })
      // Enhance text clarity
      .normalize()
      .sharpen({ sigma: 1, m1: 0.5, m2: 2 })
      // Convert to optimal format for OCR
      .jpeg({
        quality: MEMORY_SETTINGS.jpegQuality,
        progressive: false,
        mozjpeg: true
      });
    
    const processedBuffer = await sharpInstance.toBuffer();
    
    // Save processed image
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const imagePath = path.join(
      uploadDir, 
      `ocr_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`
    );
    
    fs.writeFileSync(imagePath, processedBuffer);
    
    const processingTime = Date.now() - startTime;
    console.log(
      `Image preprocessed in ${processingTime}ms: ` +
      `${inputBuffer.length} → ${processedBuffer.length} bytes ` +
      `(${Math.round((1 - processedBuffer.length/inputBuffer.length) * 100)}% reduction)`
    );
    
    return {
      buffer: processedBuffer,
      path: imagePath,
      metadata: {
        originalSize: inputBuffer.length,
        processedSize: processedBuffer.length,
        dimensions: { width, height },
        processingTime
      }
    };
    
  } catch (error: any) {
    console.error("Image preprocessing failed:", error.message);
    throw new Error(`Image preprocessing failed: ${error.message}`);
  }
}

// Memory cleanup utility
function forceGarbageCollection() {
  if (global.gc) {
    global.gc();
    console.log("Forced garbage collection");
  }
}

// Clean up function for graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Shutting down OCR instance...");
  if (globalOCR) {
    try {
      await globalOCR.close();
      console.log("OCR instance closed successfully");
    } catch (error: any) {
      console.error("Error closing OCR instance:", error.message);
    }
  }
  process.exit(0);
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let imagePath: string | null = null;
  const memoryBefore = process.memoryUsage();
  
  try {
    console.log(`Memory before request: ${Math.round(memoryBefore.heapUsed / 1024 / 1024)}MB`);
    
    // Parse form data with size limits
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

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
        error: "Invalid file type. Please upload an image.",
        code: "INVALID_FILE_TYPE",
        text: { data: [] }
      }, { status: 400 });
    }

    // Validate file size
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

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(`File received: ${file.name} (${buffer.length} bytes, type: ${file.type})`);

    // Preprocess image with Sharp
    let processedImage;
    try {
      processedImage = await preprocessImage(buffer, file.name);
      imagePath = processedImage.path;
    } catch (preprocessError: any) {
      console.error("Image preprocessing failed:", preprocessError.message);
      return NextResponse.json({ 
        status: "error",
        error: "Failed to process image. The image might be corrupted or in an unsupported format.",
        code: "PREPROCESSING_FAILED",
        text: { data: [] },
        details: preprocessError.message
      }, { status: 500 });
    }

    // Force garbage collection after image processing
    forceGarbageCollection();
    
    const memoryAfterPreprocessing = process.memoryUsage();
    console.log(`Memory after preprocessing: ${Math.round(memoryAfterPreprocessing.heapUsed / 1024 / 1024)}MB`);

    // Get OCR instance and process image
    try {
      const ocr = await getOCRInstance();
      console.log("Starting OCR processing...");
      
      const ocrStartTime = Date.now();
      const result = await ocr.readText(imagePath) as unknown as {data:string};
      const ocrDuration = Date.now() - ocrStartTime;
      
      console.log(`OCR completed in ${ocrDuration}ms`);
      
      // Force cleanup after OCR
      forceGarbageCollection();
      
      const memoryAfterOCR = process.memoryUsage();
      console.log(`Memory after OCR: ${Math.round(memoryAfterOCR.heapUsed / 1024 / 1024)}MB`);
      
      // Validate OCR result structure
      if (!result || !result.data || !Array.isArray(result.data)) {
        console.warn("Invalid OCR result structure:", result);
        return NextResponse.json({
          status: "error",
          error: "OCR processing returned invalid data",
          code: "INVALID_OCR_RESULT",
          text: { data: [] }
        }, { status: 500 });
      }
      
      // Check if any text was found
      const hasText = result.data.length > 0 && 
        result.data.some(item => item.text && item.text.trim().length > 0);
      
      if (!hasText) {
        console.log("No text detected in image");
        return NextResponse.json({
          status: "success",
          text: { data: [] },
          message: "No text found in the image",
          metadata: {
            processingTime: Date.now() - startTime,
            ocrTime: ocrDuration,
            imageProcessing: processedImage.metadata
          }
        }, { status: 200 });
      }

      const totalDuration = Date.now() - startTime;
      const memoryFinal = process.memoryUsage();
      
      console.log(`Total processing completed in ${totalDuration}ms`);
      console.log(`Text found: ${result.data.length} items`);
      console.log(`Memory final: ${Math.round(memoryFinal.heapUsed / 1024 / 1024)}MB`);

      return NextResponse.json({
        status: "success",
        text: result,
        metadata: {
          processingTime: totalDuration,
          ocrTime: ocrDuration,
          imageProcessing: processedImage.metadata,
          memoryUsage: {
            before: Math.round(memoryBefore.heapUsed / 1024 / 1024),
            afterPreprocessing: Math.round(memoryAfterPreprocessing.heapUsed / 1024 / 1024),
            afterOCR: Math.round(memoryAfterOCR.heapUsed / 1024 / 1024),
            final: Math.round(memoryFinal.heapUsed / 1024 / 1024)
          }
        }
      }, { status: 200 });

    } catch (ocrError: any) {
      console.error("OCR processing failed:", ocrError.message);
      console.error("OCR error stack:", ocrError.stack);
      
      // Reset OCR instance on critical errors
      if (ocrError.message.includes("Reader not initialized") || 
          ocrError.message.includes("CUDA") ||
          ocrError.message.includes("memory")) {
        console.log("Resetting OCR instance due to critical error");
        globalOCR = null;
        isInitializing = false;
        initPromise = null;
      }
      
      let errorCode = "OCR_FAILED";
      let userMessage = "Failed to extract text from image";
      
      if (ocrError.message.includes("memory")) {
        errorCode = "OCR_MEMORY_ERROR";
        userMessage = "Not enough memory to process this image. Try a smaller image.";
      } else if (ocrError.message.includes("timeout")) {
        errorCode = "OCR_TIMEOUT";
        userMessage = "OCR processing timed out. Try again with a smaller image.";
      }
      
      return NextResponse.json({ 
        status: "error",
        error: userMessage,
        code: errorCode,
        text: { data: [] },
        details: process.env.NODE_ENV === 'development' ? ocrError.message : undefined
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Server error:", error.message);
    console.error("Server error stack:", error.stack);
    
    let errorCode = "SERVER_ERROR";
    let userMessage = "Internal server error occurred";
    
    if (error.message.includes("out of memory")) {
      errorCode = "MEMORY_ERROR";
      userMessage = "Server is low on memory. Please try again later.";
    } else if (error.message.includes("timeout")) {
      errorCode = "TIMEOUT_ERROR";
      userMessage = "Request timed out. Please try again.";
    }
    
    return NextResponse.json({ 
      status: "error",
      error: userMessage,
      code: errorCode,
      text: { data: [] },
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  } finally {
    // Clean up uploaded image
    if (imagePath && fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        console.log(`Cleaned up temporary image: ${imagePath}`);
      } catch (unlinkError: any) {
        console.error("Failed to cleanup image:", unlinkError.message);
      }
    }
    
    // Final cleanup
    forceGarbageCollection();
    
    const totalDuration = Date.now() - startTime;
    const memoryFinal = process.memoryUsage();
    console.log(`Request completed in ${totalDuration}ms`);
    console.log(`Final memory: ${Math.round(memoryFinal.heapUsed / 1024 / 1024)}MB`);
  }
}