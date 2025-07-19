import React, { memo, useCallback, lazy, useState, useEffect, Suspense } from 'react'

import {
    Languages,
    ArrowRight,
    ArrowLeft,
} from 'lucide-react';
import Image from 'next/image';
const TextToSpeech = memo(lazy(() => import('./TextToSpeech')));
const OCROverlay = memo(lazy(() => import('./OCROverlay')));
import Placeholder from './Placeholder';
import handleTranslate from '../../util/ReadChapterUtils/handleTranslate';
function MiddleImageAndOptions({
    layout,
    isLoading,
    pages,
    quality,
    currentIndex,
    panels,
    showTranslationAndSpeakingOptions,
    chapterInfo,
    pageTranslations,
    setPageTranslations,
    pageTTS,
    setPageTTS,
    fullOCRResult,
    setFullOCRResult,
    isItTextToSpeech,
    setIsItTextToSpeech,
    setShowMessage,
    showMessage,
    allAtOnce,
    goToPrevChapter,
    hasPrevChapter,
    goToNextChapter,
    hasNextChapter,
    isCollapsed
}) {
    if (!(chapterInfo && pages)) return null
    const [cursorClass, setCursorClass] = useState('');
    const [imageCache, setImageCache] = useState([]);
    const [imageKey, setImageKey] = useState(0);
    const [isLoadingOCR, setIsLoadingOCR] = useState(false);
    const [translatedTexts, setTranslatedTexts] = useState({});
    const [overlayLoading, setOverlayLoading] = useState(false);
    const handleImageLoad = useCallback((url) => {
        setImageCache((prevCache) => [...prevCache, url]);
    }, []);

    const memoizedHandleTranslate = useCallback(
        (text) => handleTranslate(text),
        []
    );
    // console.log(pageTranslations) 
    // console.log(pageTTS) 

    const handleImageError = useCallback(() => {
        setImageKey((prevKey) => prevKey + 1);
    }, []);
    const translateAll = useCallback(async (fullOCRResult) => {
        if (!fullOCRResult || fullOCRResult.length === 0) return;

        const needsTranslation = fullOCRResult.some(
            (item) => !translatedTexts[item.text] && item.text.trim() !== ""
        );

        if (!needsTranslation) return;

        setOverlayLoading(true);
        try {
            const newTranslations = { ...translatedTexts };
            const untranslatedItems = fullOCRResult.filter(
                (item) => !translatedTexts[item.text] && item.text.trim() !== ""
            );

            const batchSize = 5;
            for (let i = 0; i < untranslatedItems.length; i += batchSize) {
                const batch = untranslatedItems.slice(i, i + batchSize);
                const results = await Promise.all(
                    batch.map((item) => memoizedHandleTranslate(item.text))
                );
                batch.forEach((item, index) => {
                    newTranslations[item.text] = results[index];
                });
            }
            setTranslatedTexts(newTranslations);
            return newTranslations;
        } catch (error) {
            console.error("Error translating batch:", error);
        } finally {
            setOverlayLoading(false);
        }
    }, [translatedTexts, memoizedHandleTranslate]);

    const handleUpload = useCallback(async (imageUrl, from) => {
        if (!imageUrl) return alert("No image found!");

        setIsLoadingOCR(true);
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], "image.jpg", { type: blob.type });

            const formData = new FormData();
            formData.append("file", file);

            const apiResponse = await fetch("/api/readTextAndReplace", {
                method: "POST",
                body: formData,
            });

            if (!apiResponse.ok) throw new Error("API request failed");

            const result = await apiResponse.json();
            console.log("OCR Result:", result);

            const ocrResult = result.text.data;
            const processedText = result.status === "error" ? "No Text Found" : result.text.data.map((item) => item.text).join(" ");

            if (from === "translate") {
                const translated = await memoizedHandleTranslate(processedText);
                const translatedocrResult = await translateAll(ocrResult);
                // console.log(translated)
                setPageTranslations((prev) => ({
                    ...prev,
                    [imageUrl]: {
                        ocrResult: ocrResult,
                        translatedocrResult: translatedocrResult,
                        textResult: translated,
                    },
                }));
                setIsItTextToSpeech(false);
            } else {
                setPageTTS((prev) => ({
                    ...prev,
                    [imageUrl]: {
                        ocrResult: ocrResult,
                        textResult: processedText,
                    },
                }));
                setFullOCRResult(ocrResult);
                setIsItTextToSpeech(true);
            }
            setShowMessage(true);
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        } finally {
            setIsLoadingOCR(false);
        }
    }, [memoizedHandleTranslate, translateAll]);


    useEffect(() => {
        if (layout === "vertical") {
            // Remove any cursor class if needed
            setCursorClass('');
            return; // Exit early, no event listener added
        }

        const handleMouseMove = (event) => {
            // Your existing mouse move logic here
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            if (mouseY < screenHeight / 5.5) {
                setCursorClass('');
                return;
            }

            const middleStart = (screenWidth - 500) / 2;
            const middleEnd = middleStart + 600;

            if (mouseX < middleStart || mouseX > middleEnd) {
                setCursorClass('');
                return;
            }

            const screenMidPoint = screenWidth / 2;
            if (mouseX < screenMidPoint) {
                setCursorClass('cursor-left-arrow');
            } else {
                setCursorClass('cursor-right-arrow');
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [layout]);
    return (
        <Suspense fallback={<div className='w-full flex flex-row justify-center items-center'><Placeholder /></div>}>
            <div
                className={`flex ${isCollapsed ? "" : "ml-14 md:ml-0"} ${layout == "horizontal" ? cursorClass : ""} pl-3 md:px-0  flex-1 ${layout === "horizontal"
                    ? "flex-row space-x-4 overflow-hidden justify-center mt-5 items-start"
                    : "flex-col space-y-4 mt-5 justify-end items-center"
                    } my-1`}
            >
                {isLoading ? (
                    <Placeholder />
                ) : (
                    layout === "horizontal"
                        ? pages != undefined &&
                        (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data)
                            .slice(Math.abs(currentIndex), Math.abs(currentIndex + panels))
                            .map((page, index) => (
                                <div key={index} className="tracking-wider   relative h-screen md:h-[87vh] flex justify-center items-center">
                                    <div className={`relative w-auto h-screen md:h-[87vh]`}>
                                        <Image
                                            key={imageKey}
                                            src={page}
                                            alt={`Page ${currentIndex + index + 1}`}
                                            height={1680}
                                            width={1680}
                                            className={`object-contain border border-gray-500/50 rounded-lg w-full h-full shadow-xl transition-all ${imageCache.includes(page) ? "block" : "hidden"
                                                }`}
                                            priority={index === 0}
                                            loading={index === 0 ? undefined : "eager"}
                                            onLoadingComplete={() => handleImageLoad(page)}
                                            onError={handleImageError}
                                            placeholder="blur"
                                            blurDataURL="/placeholder.jpg"
                                        />
                                        {!isLoadingOCR && chapterInfo?.translatedLanguage?.trim() !== "en" ? (
                                            <OCROverlay
                                                loading={overlayLoading}
                                                handleTranslate={memoizedHandleTranslate} // Use memoized version
                                                translatedTexts={translatedTexts}
                                                fullOCRResult={fullOCRResult}
                                            />
                                        ) : (
                                            ""
                                        )}
                                        {!imageCache.includes(page) && <Placeholder />}
                                    </div>
                                    {showTranslationAndSpeakingOptions && (panels != 2 && <div className="tracking-wider fixed flex flex-col justify-end items-end bottom-32 right-7">
                                        {!isLoadingOCR ? (
                                            <>
                                                {chapterInfo?.translatedLanguage?.trim() !== "en" && (
                                                    <button
                                                        disabled={panels === 2 || pageTranslations[page]}
                                                        onClick={() => handleUpload(page, "translate")}
                                                        className={`group py-2 sm:py-4 px-1 sm:px-2 mb-4 before:bg-opacity-60 flex items-center justify-start min-w-[36px] sm:min-w-[48px] h-12 sm:h-20 text-gray-100 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300  
    shadow-[0px_0px_10px_rgba(0,0,0,1)] shadow-yellow-500 bg-[#1a063e] bg-opacity-60 hover:min-w-[140px] sm:hover:min-w-[182px] hover:shadow-lg disabled:cursor-not-allowed 
    ${panels === 2 || pageTranslations[page] ? "hidden" : ""}  backdrop-blur-md lg:font-semibold border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 
    before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] 
    hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 ease-in-out`}
                                                    >
                                                        <Languages
                                                            className="tracking-wider w-10 h-10 sm:w-16 sm:h-16 p-2 sm:p-4 text-orange-400 bg-opacity-85 group-hover:border-2 group-hover:border-yellow-500 transition-all bg-gray-50 ease-in-out duration-300 rounded-full border border-gray-700 transform group-hover:rotate-[360deg]"
                                                        />
                                                        <span
                                                            className={`absolute font-sans font-bold left-14 sm:left-20 text-sm sm:text-lg tracking-tight text-gray-100 opacity-0 transform translate-x-2 sm:translate-x-4 transition-all duration-300 
      group-hover:opacity-100 group-hover:text-black group-hover:translate-x-0 ${pageTranslations[page] ? "text-yellow-300" : ""
                                                                }`}
                                                        >
                                                            {pageTranslations[page] ? "Translated" : "Translate"}
                                                        </span>
                                                    </button>

                                                )}
                                                <TextToSpeech
                                                    page={page}
                                                    handleUpload={handleUpload}
                                                    ready={Boolean(pageTTS[page] ? isItTextToSpeech : pageTranslations[page])}
                                                    text={
                                                        ((pageTTS[page] && isItTextToSpeech) || pageTranslations[page]) &&
                                                            pageTranslations[page] ? pageTranslations[page]?.textResult : pageTTS[page]?.textResult // Use memoized result
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <div className="tracking-wider h-fit w-full flex justify-center items-center rounded-lg shadow-lg">
                                                <div className="tracking-wider flex justify-center items-center w-full h-fit">
                                                    <div className="tracking-wider text-center flex flex-col justify-center items-center">
                                                        <div className="tracking-wider spinner-border -mt-36 -ml-36 w-12 h-12 rounded-full animate-spin border-8 border-solid border-purple-500 border-t-transparent shadow-md"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {showMessage && (
                                            <div className="absolute z-50 text-wrap w-fit min-w-72 max-w-72 -top-96 border-gray-500/30 border right-12 bg-black/95 text-white p-4 rounded-lg shadow-lg transition-opacity duration-300">
                                                <button
                                                    className="absolute top-1 right-1 text-white bg-purple-600 hover:bg-gray-500 rounded-full p-1 px-2.5"
                                                    onClick={() => setShowMessage(false)}
                                                >
                                                    ✖
                                                </button>
                                                <p>{((pageTTS[page] && isItTextToSpeech) || pageTranslations[page]) && pageTranslations[page] ? pageTranslations[page]?.textResult : pageTTS[page]?.textResult || "No text Available"}</p>
                                            </div>
                                        )}
                                    </div>)}
                                </div>
                            ))
                        : (
                            <div className='w-full'>{pages &&
                                (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data).map(
                                    (page, index) => (
                                        <div
                                            key={index}
                                            className={`tracking-wider px-4 md:px-0 ${allAtOnce && (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data).map((p) => {
                                                if (!imageCache.includes(p)) return false
                                            }).includes(false) ? "hidden" : "block"} relative h-fit w-full flex justify-center items-center`}
                                        >
                                            <div className={`relative w-auto h-fit`}>
                                                <Image
                                                    key={imageKey}
                                                    src={page}
                                                    alt={`Page ${index + 1}`}
                                                    height={1680}
                                                    width={1680}
                                                    className={`object-contain border border-gray-500/50 rounded-lg w-full max-w-[1280px] h-auto shadow-xl transition-all ${imageCache.includes(page) ? "block" : "hidden"
                                                        }`}
                                                    priority={index === 0}
                                                    loading={index === 0 ? undefined : "eager"}
                                                    onLoadingComplete={() => handleImageLoad(page)}
                                                    onError={handleImageError}
                                                    placeholder="blur"
                                                    blurDataURL="/placeholder.jpg"
                                                />
                                                {!isLoadingOCR && chapterInfo?.translatedLanguage?.trim() !== "en" ? (
                                                    <OCROverlay
                                                        loading={overlayLoading}
                                                        handleTranslate={memoizedHandleTranslate} // Use memoized version
                                                        ready={Boolean(pageTranslations[page]?.translatedocrResult)}
                                                        translatedTexts={pageTranslations[page]?.translatedocrResult}
                                                        fullOCRResult={pageTranslations[page]?.ocrResult}
                                                    />
                                                ) : (
                                                    ""
                                                )}
                                                {!imageCache.includes(page) && <Placeholder />}
                                            </div>
                                            {showTranslationAndSpeakingOptions && <div className="tracking-wider absolute top-52 transform space-y-4 flex flex-col justify-start items-end bottom-28 right-3">
                                                {!isLoadingOCR ? (
                                                    <>
                                                        {chapterInfo?.translatedLanguage?.trim() !== "en" && (
                                                            <button
                                                                disabled={panels === 2 || pageTranslations[page]}
                                                                onClick={() => handleUpload(page, "translate")}
                                                                className={`font-sans ${panels === 2 || pageTranslations[page] ? "hidden" : ""
                                                                    } tracking-wider min-h-16 text-[11px] font-sans before:bg-opacity-60 min-w-[125px] sm:min-w-[189px] transition-colors flex gap-2 justify-start items-center mx-auto shadow-xl sm:text-lg text-white bg-[#1a063e] backdrop-blur-md lg:font-semibold isolation-auto border-gray-50/50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-2 py-1 sm:px-3 sm:py-2 ease-in-out overflow-hidden border-2 rounded-full group`}
                                                                type="submit"
                                                            >
                                                                <Languages className="tracking-wider w-8 h-8 sm:w-12 sm:h-12 bg-opacity-85 group-hover:border-2 group-hover:border-yellow-500 transition-all bg-gray-50 text-orange-400 ease-in-out duration-300 rounded-full border border-gray-700 p-2 md:p-3 transform group-hover:rotate-[360deg]" />
                                                                {pageTranslations[page] ? "Translated" : "Translate"}
                                                            </button>
                                                        )}
                                                        <TextToSpeech
                                                            page={page}
                                                            handleUpload={handleUpload}
                                                            ready={Boolean(pageTTS[page] ? isItTextToSpeech : pageTranslations[page])}
                                                            text={
                                                                ((pageTTS[page] && isItTextToSpeech) || pageTranslations[page]) &&
                                                                    pageTranslations[page] ? pageTranslations[page]?.textResult : pageTTS[page]?.textResult // Use memoized result
                                                            }
                                                            layout={layout}
                                                        />
                                                    </>
                                                ) : (
                                                    <div className="tracking-wider h-fit w-full flex justify-center items-center rounded-lg shadow-lg">
                                                        <div className="tracking-wider flex justify-center items-center w-full h-fit">
                                                            <div className="tracking-wider text-center flex flex-col justify-center items-center">
                                                                <div className="tracking-wider spinner-border -mt-36 -ml-36 w-12 h-12 rounded-full animate-spin border-8 border-solid border-purple-500 border-t-transparent shadow-md"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>}
                                        </div>
                                    )
                                )}
                                <div className={`tracking-wider ${allAtOnce && (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data).map((p) => {
                                    if (!imageCache.includes(p)) return false
                                }).includes(false) ? "hidden" : "block"} px-[27%] mt-4 mb-20 h-20 grid grid-cols-2 gap-2`}>
                                    <button
                                        onClick={goToPrevChapter}
                                        disabled={!hasPrevChapter}
                                        className={`flex  gap-3 items-center justify-center py-2 rounded-lg ${hasPrevChapter
                                            ? 'bg-purple-900/30 text-white border border-purple-700/20 hover:bg-purple-800/40'
                                            : 'bg-gray-800/30 text-gray-500 border border-gray-700/20 cursor-not-allowed'
                                            }`}
                                        aria-label="Previous chapter"
                                    >
                                        <ArrowLeft className="w-5 h-5 font-bold" />
                                        <span className=" ml-1 text-base font-bold">Previous</span>
                                    </button>
                                    <button
                                        onClick={goToNextChapter}
                                        disabled={!hasNextChapter}
                                        className={`flex items-center gap-3 justify-center py-2 rounded-lg ${hasNextChapter
                                            ? 'bg-purple-900/30 text-white border border-purple-700/20 hover:bg-purple-800/40'
                                            : 'bg-gray-800/30 text-gray-500 border border-gray-700/20 cursor-not-allowed'
                                            }`}
                                        aria-label="Next chapter"
                                    >
                                        <span className=" mr-1 text-base font-bold">Next</span>
                                        <ArrowRight className="w-5 h-5 font-bold" />
                                    </button>
                                </div>
                                {(allAtOnce && (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data).map((p) => {
                                    if (!imageCache.includes(p)) return false
                                }).includes(false)) && <div className=' absolute top-7 left-[40%]'><Placeholder /></div>}
                            </div>
                        )
                )}
            </div>
        </Suspense>
    )
}

export default MiddleImageAndOptions