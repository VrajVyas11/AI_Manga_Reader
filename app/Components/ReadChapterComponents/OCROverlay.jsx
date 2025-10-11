import React, { useCallback, useMemo } from "react";

const OCROverlay = ({
  imageElement,
  fullOCRResult,
  translatedTexts,
  loading,
  // layout = "vertical",
  isDark = true
}) => {
  console.log("=== OCR OVERLAY DEBUG ===");
  console.log("imageElement:", imageElement);
  console.log("fullOCRResult:", fullOCRResult);
  console.log("translatedTexts:", translatedTexts);

  // Function to get the displayed text for an item
  const getDisplayText = useCallback((originalText) => {
    if (loading && !translatedTexts[originalText]) {
      return "Translating...";
    }
    return translatedTexts[originalText] ?? originalText;
  }, [loading, translatedTexts]);

  // Calculate the transformation from OCR coordinates to display coordinates
  const coordinateTransform = useMemo(() => {
    if (!imageElement) {
      console.warn("No imageElement provided");
      return null;
    }

    try {
      // Natural dimensions = what OCR sees (original image size)
      const naturalWidth = imageElement.naturalWidth;
      const naturalHeight = imageElement.naturalHeight;

      // Rendered dimensions = what user sees on screen
      // const rect = imageElement.getBoundingClientRect();
      // const displayWidth = rect.width;
      // const displayHeight = rect.height;

      console.log("Natural dimensions:", { naturalWidth, naturalHeight });
      // console.log("Display dimensions:", { displayWidth, displayHeight });

      if (!naturalWidth || !naturalHeight
        //  || !displayWidth || !displayHeight
      ) {
        console.warn("Invalid dimensions detected");
        return null;
      }

      // Calculate how the image is actually displayed (object-contain)
      // const naturalAspect = naturalWidth / naturalHeight;
      // const displayAspect = displayWidth / displayHeight;

      let actualDisplayWidth, actualDisplayHeight;
      let offsetX = 0, offsetY = 0;

      // if (naturalAspect > displayAspect) {
      //   // Image is wider than container - limited by width
      //   // Image fills full width, height is less
      //   actualDisplayWidth = displayWidth;
      //   actualDisplayHeight = displayWidth / naturalAspect;
      //   offsetY = (displayHeight - actualDisplayHeight) / 2;
      // } else {
      //   // Image is taller than container - limited by height
      //   // Image fills full height, width is less
      //   actualDisplayHeight = displayHeight;
      //   actualDisplayWidth = displayHeight * naturalAspect;
      //   offsetX = (displayWidth - actualDisplayWidth) / 2;
      // }

      // Scale factor: how much to multiply OCR coordinates by
      const scaleX = naturalWidth * 0.7 / naturalWidth;
      const scaleY = naturalHeight / naturalHeight;

      console.log("Transform calculated:", {
        scaleX,
        scaleY,
        offsetX,
        offsetY,
        actualDisplayWidth,
        actualDisplayHeight
      });

      return { scaleX, scaleY, offsetX, offsetY };
    } catch (error) {
      console.error("Error calculating coordinate transform:", error);
      return null;
    }
  }, [imageElement]);

  // Don't render if no data
  if (!fullOCRResult || !Array.isArray(fullOCRResult) || fullOCRResult.length === 0) {
    console.log("No OCR results to display");
    return null;
  }

  if (!imageElement) {
    console.warn("OCROverlay: No image element provided");
    return null;
  }

  if (!coordinateTransform) {
    console.warn("OCROverlay: Could not calculate coordinate transform");
    return null;
  }

  const { scaleX, scaleY, offsetX, offsetY } = coordinateTransform;

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      {fullOCRResult.map((item, i) => {
        // Validate bbox structure
        if (!item.bbox || !Array.isArray(item.bbox) || item.bbox.length < 4) {
          console.warn(`OCROverlay: Invalid bbox for item ${i}`, item);
          return null;
        }

        try {
          // Extract coordinates - bbox format: [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
          const [[x1, y1], [x2,], [, y3], [,]] = item.bbox;

          // Transform OCR coordinates to display coordinates
          const displayX = (x1 * scaleX) + offsetX;
          const displayY = (y1 * scaleY) + offsetY;

          // Calculate bbox dimensions in display space
          const bboxWidth = Math.abs(x2 - x1);
          const bboxHeight = Math.abs(y3 - y1);
          const displayWidth = bboxWidth * scaleX;
          const displayHeight = bboxHeight * scaleY;

          // Calculate appropriate font size based on display height
          // Typical manga text height is good for 10-14px font
          const fontSize = Math.max(9, Math.min(12, displayHeight * 0.7));

          // Get the text to display
          const displayText = getDisplayText(item.text);

          if (i === 0) {
            console.log(`Item ${i} transform:`, {
              ocrCoords: { x: x1, y: y1, w: bboxWidth, h: bboxHeight },
              displayCoords: { x: displayX, y: displayY, w: displayWidth, h: displayHeight },
              fontSize,
              text: item.text.substring(0, 30)
            });
          }

          return (
            <div
              key={i}
              className={`absolute font-semibold lowercase leading-tight font-sans tracking-normal rounded shadow-sm flex items-start justify-start overflow-visible pointer-events-auto transition-all duration-200 hover:z-50 ${isDark ? "bg-white/95 text-black shadow-black/50" : "bg-white/90 text-gray-900 shadow-black/30"
                }`}
              style={{
                left: `${displayX}px`,
                top: `${displayY}px`,
                // minWidth: `${displayWidth}px`,
                maxWidth: `${displayWidth * 2}px`, // Allow expansion for translated text
                // minHeight: `${displayHeight}px`,
                fontSize: `${fontSize}px`,
                lineHeight: `${fontSize * 1.15}px`,
                padding: '2px 4px',
              }}
            >
              <span className="relative block">{displayText}</span>
            </div>
          );
        } catch (error) {
          console.error(`Error rendering OCR item ${i}:`, error, item);
          return null;
        }
      })}
    </div>
  );
};

export default OCROverlay;