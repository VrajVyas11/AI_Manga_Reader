import React, { useCallback } from "react";
const OCROverlay = ({
  imageElement = { naturalWidth: 400, naturalHeight: 1204 },
  fullOCRResult,
  translatedTexts,
  loading,
  layout = "vertical"
}) => {

  // Function to get the displayed text for an item
  const getDisplayText = useCallback((originalText) => {
    if (loading && !translatedTexts[originalText]) {
      return "Translating...";
    }
    return translatedTexts[originalText] || originalText;
  }, [loading, translatedTexts]);
  //  console.log(imageElement.naturalWidth);
  // console.log(imageElement.naturalHeight);
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      {fullOCRResult &&
        fullOCRResult.map((item, i) => {
          const [[x1, y1], [], , [,]] = item.bbox;
          //  const originalImageWidth = 1680;
          //  const originalImageHeight = 1680;
          //  const imageAspectRatio = originalImageWidth / originalImageHeight;
          //  const containerAspectRatio =
          //    380 / (window.innerHeight * item.confidence);

          //  let renderedWidth, renderedHeight;
          //  if (imageAspectRatio > containerAspectRatio) {
          //    renderedWidth = 380;
          //    renderedHeight = 380 / imageAspectRatio;
          //  } else {
          //    renderedHeight = window.innerHeight * item.confidence;
          //    renderedWidth = renderedHeight * imageAspectRatio;
          //  }

          //  const offsetX = (380 - renderedWidth) / 2;
          //  const offsetY = (810 - renderedHeight) / 15;
          //  const scaleX = renderedWidth / originalImageWidth;
          //  const scaleY = (renderedHeight / originalImageHeight) * 1.4;

          //  const scaledX = x1 * scaleX + offsetX;
          //  const scaledY = y1 * scaleY + offsetY - 60;

          const scaledX = x1 * imageElement.naturalWidth / (imageElement.naturalHeight / imageElement.naturalWidth > 2 ? imageElement.naturalWidth * 3 : imageElement.naturalWidth * (layout == "vertical" ? 2 : 2.5))
          const scaledY = y1 * imageElement.naturalHeight / (imageElement.naturalHeight > 900 ? imageElement.naturalHeight * 4 : imageElement.naturalHeight * (layout == "vertical" ? 2 : 2.5));
          return (
            <div
              key={i}
              className="absolute leading-[10px] font-sans tracking-widest rounded-lg  shadow-md shadow-black/20 bg-white flex-wrap w-fit max-w-[180px] h-auto text-black font-bold text-[8px] flex justify-center items-center overflow-hidden p-0.5"
              style={{
                left: `${scaledX * item.confidence}px`,
                top: `${scaledY}px`,
                // fontSize: `12px`,
                // lineHeight: `5px`,
                // whiteSpace: 'nowrap',
                // textOverflow: 'ellipsis',
              }}
            >
              <div className="relative">{getDisplayText(item.text)}</div>
            </div>
          );
        })}
    </div>
  );
};

export default OCROverlay;