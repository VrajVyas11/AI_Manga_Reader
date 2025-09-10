/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import EasyOCRWrapper from "easyocr-js";

// Global OCR instance to avoid repeated initialization
let globalOCR: EasyOCRWrapper | null = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

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
    console.log("🔄 Initializing OCR instance...");
    const startTime = Date.now();
    
    globalOCR = new EasyOCRWrapper();
    
    // Initialize with English only for faster startup
    // Models should already be downloaded during Docker build
    await globalOCR.init("en");
    
    const duration = Date.now() - startTime;
    console.log(`✅ OCR initialized successfully in ${duration}ms`);
  } catch (error: any) {
    console.error("❌ OCR initialization failed:", error.message);
    globalOCR = null;
    throw error;
  }
}

// Clean up function for graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🔄 Shutting down OCR instance...");
  if (globalOCR) {
    try {
      await globalOCR.close();
      console.log("✅ OCR instance closed successfully");
    } catch (error: any) {
      console.error("❌ Error closing OCR instance:", error.message);
    }
  }
  process.exit(0);
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let imagePath: string | null = null;

  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.type.startsWith("image/")) {
      return NextResponse.json({ 
        error: "Invalid or missing image file" 
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 10MB" 
      }, { status: 400 });
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save uploaded image
    imagePath = path.join(uploadDir, `ocr_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`);
    
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(imagePath, buffer);
      console.log(`✅ Image saved: ${imagePath} (${buffer.length} bytes)`);
    } catch (writeError: any) {
      console.error("❌ File Write Error:", writeError.message);
      return NextResponse.json({ 
        error: "Failed to save image file" 
      }, { status: 500 });
    }

    // Get OCR instance and process image
    try {
      const ocr = await getOCRInstance();
      console.log("🔄 Processing OCR...");
      
      const ocrStartTime = Date.now();
      const result = await ocr.readText(imagePath);
      const ocrDuration = Date.now() - ocrStartTime;
      
      console.log(`✅ OCR completed in ${ocrDuration}ms`);
      
      // Format the response
      const totalDuration = Date.now() - startTime;
      
      return NextResponse.json({
        success: true,
        text: result,
        processingTime: totalDuration,
        ocrTime: ocrDuration
      }, { status: 200 });

    } catch (ocrError: any) {
      console.error("❌ OCR Error:", ocrError.message);
      
      // If OCR fails due to initialization issues, reset global instance
      if (ocrError.message.includes("Reader not initialized")) {
        console.log("🔄 Resetting OCR instance due to initialization error");
        globalOCR = null;
        isInitializing = false;
        initPromise = null;
      }
      
      return NextResponse.json({ 
        error: `OCR processing failed: ${ocrError.message}`,
        details: "The OCR service may be initializing. Please try again in a moment."
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("❌ Server Error:", error.message);
    return NextResponse.json({ 
      error: `Internal server error: ${error.message}` 
    }, { status: 500 });
  } finally {
    // Clean up uploaded image
    if (imagePath && fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        console.log(`🗑️ Image deleted: ${imagePath}`);
      } catch (unlinkError: any) {
        console.error("❌ Error deleting image:", unlinkError.message);
      }
    }
    
    const totalDuration = Date.now() - startTime;
    console.log(`⏱️ Total request duration: ${totalDuration}ms`);
  }
}