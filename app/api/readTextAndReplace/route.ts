/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import EasyOCRWrapper from "easyocr-js";

// Utility to add a timeout to promises
const withTimeout = (promise: Promise<any>, ms: number) => {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("OCR operation timed out")), ms);
  });
  return Promise.race([promise, timeout]);
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid or missing image file" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imagePath = path.join(uploadDir, `uploaded_image_${Date.now()}.jpg`);

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(imagePath, buffer);
      console.log(`✅ Image saved: ${imagePath}`);
    } catch (writeError) {
      console.error("File Write Error:", writeError);
      return NextResponse.json({ error: "Failed to write image file" }, { status: 500 });
    }

    let ocr: EasyOCRWrapper | undefined;
    try {
      ocr = new EasyOCRWrapper();

      // Initialize OCR with a timeout of 10 seconds
      await withTimeout(ocr.init("en"), 10000);

      // Read text with a timeout of 30 seconds
      const result = await withTimeout(ocr.readText(imagePath), 30000);

      return NextResponse.json({ text: result }, { status: 200 });
    } catch (error: any) {
      console.error("OCR Error:", error.message);
      return NextResponse.json({ error: `OCR processing failed: ${error.message}` }, { status: 500 });
    } finally {
      // Ensure OCR process is closed and image is cleaned up
      if (ocr) {
        try {
          await withTimeout(ocr.close(), 5000);
        } catch (closeError: any) {
          console.error("Error closing OCR process:", closeError.message);
        }
      }
      // Clean up the uploaded image
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log(`🗑️ Image deleted: ${imagePath}`);
        } catch (unlinkError: any) {
          console.error("Error deleting image:", unlinkError.message);
        }
      }
    }
  } catch (error: any) {
    console.error("Server Error:", error.message);
    return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
  }
}