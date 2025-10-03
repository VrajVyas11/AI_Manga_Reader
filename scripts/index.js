import Ocr from "./main.js";

class OcrWrapper {
  constructor() {
    this.ocrInstance = null;
    this.currentLanguage = "en";
    this.isInitialized = false;
    console.log("OCR Wrapper initialized");
  }

  async init(languages = "en") {
    const startTime = performance.now();
    try {
      this.currentLanguage = languages;
      
      // Initialize OCR with settings matching the CLI version
      this.ocrInstance = await Ocr.create({
        threshold: 0.1,
        minSize: 5,
        maxSize: 1000,
        unclipRatio: 1.8,
        language: languages,
        confidenceThreshold: 0.6,
        imageHeight: 48,
        removeDuplicateChars: true
      });
      
      this.isInitialized = true;
      const endTime = performance.now();
      
      console.log(`OCR initialized for language: ${languages} in ${((endTime - startTime) / 1000).toFixed(3)}s`);
      
      return {
        status: "success",
        message: `OCR initialized for ${languages}`,
        langs: languages,
        memory_usage: "~N/A (Browser environment)"
      };
    } catch (error) {
      console.error("OCR initialization error:", error);
      return {
        status: "error",
        message: `Failed to initialize OCR: ${error.message}`
      };
    }
  }

  async readText(imagePath, language = "en") {
    const startTime = performance.now();
    
    try {
      // Reinitialize if language changed
      if (language !== this.currentLanguage || !this.isInitialized) {
        await this.init(language);
      }

      console.log(`Processing image with language: ${language}`);
      console.log(`Image path: ${imagePath}`);

      // Run OCR detection using the detect method
      const result = await this.ocrInstance.detect(imagePath);

      if (!result?.texts || result.texts.length === 0) {
        return {
          status: "success",
          data: [],
          paragraphs: [],
          message: "No text detected in image"
        };
      }

      // Process individual elements - EXACT SAME AS main.js
      const individualElements = result.texts
        .filter(item => item?.text && item.text.trim().length > 0)
        .map(item => ({
          text: item.text.trim(),
          confidence: item.mean,
          frame: this.ocrInstance.extractFrameFromBox(item.box),
          box: item.box
        }));

      if (individualElements.length === 0) {
        return {
          status: "success",
          data: [],
          paragraphs: [],
          message: "No text detected in image"
        };
      }

      console.log(`Found ${individualElements.length} individual text elements`);

      // Group text elements into paragraphs - USING EXACT FUNCTIONS FROM main.js
      const groups = this.ocrInstance.groupTextElements(individualElements);
      const paragraphs = groups.map(group => this.ocrInstance.createParagraph(group));

      console.log(`Grouped into ${paragraphs.length} paragraphs`);

      // Convert to Python-compatible format
      const formattedData = individualElements.map(item => ({
        bbox: item.box,
        text: item.text,
        confidence: item.confidence
      }));

      const formattedParagraphs = paragraphs.map(para => ({
        text: para.text,
        bbox: this.calculateBboxFromBoundingBox(para.boundingBox),
        score: para.confidence,
        item_count: para.elements.length,
        individual_items: para.elements.map(el => ({
          bbox: this.calculateBboxFromFrame(el.frame),
          text: el.text,
          score: el.confidence
        }))
      }));

      const totalTime = (performance.now() - startTime) / 1000;
      const totalConfidence = individualElements.reduce((sum, el) => sum + el.confidence, 0);
      const avgConfidence = totalConfidence / individualElements.length;
      const highConfidence = individualElements.filter(el => el.confidence > 0.7).length;

      console.log(`Processing completed in ${totalTime.toFixed(2)}s`);
      console.log(`Average confidence: ${avgConfidence.toFixed(3)}`);

      return {
        status: "success",
        data: formattedData,
        paragraphs: formattedParagraphs,
        stats: {
          total_lines: individualElements.length,
          total_paragraphs: paragraphs.length,
          processing_time: `${totalTime.toFixed(3)}s`,
          image_size: 0,
          average_confidence: avgConfidence.toFixed(3),
          high_confidence_ratio: `${highConfidence}/${individualElements.length}`,
          language: language
        },
        memory_usage: "~N/A (Browser environment)"
      };

    } catch (error) {
      console.error("OCR processing error:", error);
      return {
        status: "error",
        message: `Error processing image: ${error.message}`
      };
    }
  }

  // Helper to convert boundingBox to bbox format
  calculateBboxFromBoundingBox(boundingBox) {
    const { left, top, width, height } = boundingBox;
    return [
      [left, top],
      [left + width, top],
      [left + width, top + height],
      [left, top + height]
    ];
  }

  // Helper to convert frame to bbox format
  calculateBboxFromFrame(frame) {
    const { left, top, width, height } = frame;
    return [
      [left, top],
      [left + width, top],
      [left + width, top + height],
      [left, top + height]
    ];
  }

  async close() {
    try {
      this.ocrInstance = null;
      this.isInitialized = false;
      console.log("OCR cleaned up");
      return {
        status: "success",
        message: "OCR cleaned up"
      };
    } catch (error) {
      console.error("Error while closing:", error);
      return {
        status: "error",
        message: error.message
      };
    }
  }
}

export default OcrWrapper;