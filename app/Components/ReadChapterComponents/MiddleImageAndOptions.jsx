import React, {
    memo,
    useCallback,
    lazy,
    useState,
    useEffect,
    Suspense,
    useRef,
} from "react";

import { Languages, ScrollText } from "lucide-react";
import Image from "next/image";
const TextToSpeech = memo(lazy(() => import("./TextToSpeech")));
const OCROverlay = memo(lazy(() => import("./OCROverlay")));
import Placeholder from "./Placeholder";
import handleTranslate from "../../util/ReadChapterUtils/handleTranslate";

// Toast system
import ToastsPortal, { useToast } from "../../Components/Toasts"; // adjust path if needed

function MiddleImageAndOptions({
    layout,
    isLoading,
    pages,
    setCurrentIndex,
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
    isCollapsed,
    showTranslationTextOverlay,
    isDark = true,
}) {
    const [cursorClass, setCursorClass] = useState("");
    const [imageCache, setImageCache] = useState([]);
    const [imageKey, setImageKey] = useState(0);
    const [isLoadingOCR, setIsLoadingOCR] = useState(false);
    const [translatedTexts, setTranslatedTexts] = useState({});
    const [overlayLoading, setOverlayLoading] = useState(false);
    const imageRef = useRef(null);
    const [fullOCRCompleteData, setFullOCRCompleteData] = useState()
    // stable showToast function from hook (won't change across renders)
    const { showToast } = useToast();

    const handleImageLoad = useCallback((url) => {
        setImageCache((prev) => {
            if (prev.includes(url)) return prev;
            return [...prev, url];
        });
    }, []);

    const memoizedHandleTranslate = useCallback((text) => handleTranslate(text), []);

    const handleImageError = useCallback(() => {
        setImageKey((k) => k + 1);
    }, []);

    const translateAll = useCallback(
        async (fullOCRResult) => {
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
                    batch.forEach((item, idx) => {
                        newTranslations[item.text] = results[idx];
                    });
                }
                setTranslatedTexts(newTranslations);
                return newTranslations;
            } catch (err) {
                console.error("Error translating batch:", err);
                showToast({
                    title: "Translation error",
                    message: "An error happened while translating. Tap details to see more.",
                    type: "error",
                    details: (err && (err.stack || err.message)) || String(err),
                });
            } finally {
                setOverlayLoading(false);
            }
        },
        [translatedTexts, memoizedHandleTranslate, showToast]
    );

    // handleUpload uses stable showToast but is itself memoized to avoid re-creation
    const handleUpload = useCallback(
        async (imageUrl, from) => {
            if (!imageUrl) {
                console.error("No image URL provided");
                return showToast({
                    title: "No image",
                    message: "No image URL provided. Please try again.",
                    type: "warning",
                });
            }

            setIsLoadingOCR(true);

            try {
                const response = await fetch(imageUrl);
                if (!response.ok) {
                    const errText = await response.text().catch(() => null);
                    return showToast({
                        title: "Image load failed",
                        message: "Could not fetch the image. It may be unavailable or blocked.",
                        type: "error",
                        details: `HTTP ${response.status} ${response.statusText}\n${errText || ""}`,
                    });
                }

                const blob = await response.blob();
                const file = new File([blob], "image.jpg", { type: blob.type });
                const formData = new FormData();
                formData.append("file", file);

                const apiResponse = await fetch("/api/readTextAndReplace", {
                    method: "POST",
                    body: formData,
                });

                if (!apiResponse.ok) {
                    const errorText = await apiResponse.text().catch(() => null);
                    let parsed = null;
                    try {
                        parsed = JSON.parse(errorText || "{}");
                    } catch { }
                    const userMessage =
                        parsed?.error || parsed?.message || `OCR service returned ${apiResponse.status}`;
                    return showToast({
                        title: "OCR service error",
                        message: userMessage,
                        type: "error",
                        details:
                            (parsed && JSON.stringify(parsed, null, 2)) ||
                            `HTTP ${apiResponse.status} - ${errorText || "No details"}`,
                    });
                }

                const result = await apiResponse.json();
                console.log(result)
                // unify results
                let ocrResult = [];
                let processedText = "";
                let hasValidText = false;

                if (result.paragraphs && result.paragraphs && Array.isArray(result.paragraphs)) {
                    ocrResult = result.paragraphs;
                    processedText = ocrResult
                        .filter((i) => i && i.text && i.text.trim())
                        .map((i) => i.text.trim())
                        .join(" ");
                    hasValidText = processedText.length > 0;
                    setFullOCRCompleteData(result)
                }
                else if (result.data && result.data && Array.isArray(result.data)) {
                    ocrResult = result.data;
                    processedText = ocrResult
                        .filter((i) => i && i.text && i.text.trim())
                        .map((i) => i.text.trim())
                        .join(" ");
                    hasValidText = processedText.length > 0;
                    setFullOCRCompleteData(result)
                } else if (Array.isArray(result.text)) {
                    ocrResult = result.text.map((item) => ({
                        text: typeof item === "string" ? item : item.text || String(item || ""),
                        bbox: item?.bbox || null,
                        confidence: item?.confidence || 0,
                    }));
                    processedText = ocrResult
                        .filter((i) => i.text && i.text.trim())
                        .map((i) => i.text.trim())
                        .join(" ");
                    hasValidText = processedText.length > 0;
                } else if (result.status === "error") {
                    hasValidText = false;
                } else {
                    hasValidText = false;
                }

                if (!hasValidText) {
                    return showToast({
                        title: "No text found",
                        message: "No readable text was detected. Try a clearer image.",
                        type: "info",
                        details: JSON.stringify(result, null, 2),
                    });
                }

                if (from === "translate") {
                    try {
                        const translated = await memoizedHandleTranslate(processedText);
                        const translatedocrResult = await translateAll(ocrResult);
                        setPageTranslations((prev) => ({
                            ...prev,
                            [imageUrl]: {
                                ocrResult,
                                translatedocrResult,
                                textResult: translated,
                            },
                        }));
                        setIsItTextToSpeech(false);
                        showToast({
                            title: "Translation complete",
                            message: "Text extracted and translated.",
                            type: "success",
                        });
                    } catch (err) {
                        console.error("Translation failed:", err);
                        return showToast({
                            title: "Translation failed",
                            message: "Text extracted but translation failed. Tap details for more.",
                            type: "error",
                            details: (err && (err.stack || err.message)) || String(err),
                        });
                    }
                } else {
                    setPageTTS((prev) => ({
                        ...prev,
                        [imageUrl]: { ocrResult, textResult: processedText },
                    }));
                    setFullOCRResult(ocrResult);
                    setIsItTextToSpeech(true);
                    showToast({ title: "Ready to speak", message: "Text is ready for playback.", type: "success" });
                }

                setShowMessage(true);
            } catch (err) {
                console.error("OCR Operation Error:", err);
                const msg = (err && (err.message || String(err))) || String(err);
                let errorMessage = "Something went wrong with the OCR process.";
                let toastType = "error";

                if (msg.includes("timeout")) {
                    errorMessage = "OCR request timed out. Try a smaller or clearer image.";
                    toastType = "warning";
                } else if (msg.includes("Failed to fetch")) {
                    errorMessage = "Could not load the image. Check the URL or network.";
                    toastType = "warning";
                } else if (msg.includes("memory")) {
                    errorMessage = "Server memory limit reached. Try a much smaller image or try later.";
                    toastType = "error";
                } else if (msg.includes("network")) {
                    errorMessage = "Network error. Please check connection and try again.";
                    toastType = "warning";
                }

                showToast({
                    title: "OCR error",
                    message: errorMessage,
                    type: toastType,
                    details: (err && (err.stack || err.message)) || String(err),
                });
            } finally {
                setIsLoadingOCR(false);
            }
        },
        [
            memoizedHandleTranslate,
            translateAll,
            setPageTranslations,
            setPageTTS,
            setFullOCRResult,
            setIsItTextToSpeech,
            setShowMessage,
            showToast,
        ]
    );

    //
    // Cursor + click alignment logic
    //

    // helper: try to resolve actual DOM img element (Next/Image wrapper handling)
    const getDomImageElement = useCallback((maybeRef) => {
        if (!maybeRef) return null;
        const el = maybeRef.current;
        if (!el) return null;
        try {
            if (el.tagName && el.tagName.toLowerCase() === "img") return el;
            if (el.querySelector) {
                const img = el.querySelector("img");
                if (img) return img;
            }
        } catch (e) {
            console.log(e);

            // ignore
        }
        return el;
    }, []);

    // computeCursorSide returns "left" | "right" | "" for a given pointer coordinate
    const computeCursorSide = useCallback(
        (mouseX, mouseY) => {
            // vertical early-exit (same as before)
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            if (mouseY < screenHeight / 5.5) return "";

            // Try image rect first (accurate)
            try {
                const imgEl = getDomImageElement(imageRef);
                if (imgEl && typeof imgEl.getBoundingClientRect === "function") {
                    const rect = imgEl.getBoundingClientRect();
                    const isMobile = window.innerWidth < 768;

                    if (rect.width > 6 && rect.height > 6) {
                        // const padding = Math.min(120, rect.width * 0.08); // same padding approach
                        const bandStart = rect.left - isMobile ? -30 : 150;
                        const bandEnd = rect.right + isMobile ? -30 : 150;
                        if (mouseX < bandStart || mouseX > bandEnd) return "";
                        const center = rect.left + rect.width / 2;
                        return mouseX < center ? "left" : "right";
                    }
                }
            } catch (e) {
                console.log(e);
                // continue to fallback
            }

            // Fallback: use content area (account for sidebar)
            const isMobile = window.innerWidth < 768;
            const collapsedWidth = isMobile ? 56 : 70;
            const openWidth = 288; // md:w-72 -> 288px
            const leftSidebarWidth = isMobile ? collapsedWidth : (isCollapsed ? collapsedWidth : openWidth);

            const contentLeft = leftSidebarWidth;
            const contentWidth = Math.max(0, screenWidth - leftSidebarWidth);
            if (contentWidth <= 0) return "";

            const contentCenter = contentLeft + contentWidth / 2;
            const bandWidth = Math.max(240, Math.min(900, contentWidth * 0.8));
            const bandStart = contentCenter - bandWidth / 2;
            const bandEnd = contentCenter + bandWidth / 2;

            if (mouseX < bandStart || mouseX > bandEnd) return "";
            return mouseX < contentCenter ? "left" : "right";
        },
        [getDomImageElement, isCollapsed]
    );

    // throttle mousemove via RAF using refs to avoid re-creating handlers / over-updating state
    const rafRef = useRef(0);
    const pendingRef = useRef(null);

    useEffect(() => {
        if (layout === "vertical") {
            setCursorClass("");
            return;
        }

        const onMove = (event) => {
            pendingRef.current = { x: event.clientX, y: event.clientY };
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = 0;
                const p = pendingRef.current;
                pendingRef.current = null;
                const side = computeCursorSide(p.x, p.y);
                const cls = side === "left" ? "cursor-left-arrow" : side === "right" ? "cursor-right-arrow" : "";
                setCursorClass((prev) => (prev === cls ? prev : cls));
            });
        };

        const onMouseUp = (event) => {
            pendingRef.current = { x: event.clientX, y: event.clientY };
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = 0;
                const p = pendingRef.current;
                pendingRef.current = null;
                const side = computeCursorSide(p.x, p.y);
                if (!side) return; // outside interactive band -> no nav

                const goPrev = side === "left";
                const totalPages = (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data) || pages || [];
                const totalCount = totalPages.length || (pages?.length || 0);
                if (!totalCount) return;

                let newIndex = currentIndex || 0;

                if (goPrev) {
                    if (panels === 2) {
                        newIndex = Math.max(0, newIndex - panels);
                    } else {
                        newIndex = newIndex === 0 ? Math.max(0, totalCount - panels) : Math.max(0, newIndex - panels);
                    }
                } else {
                    newIndex = newIndex + panels >= totalCount ? 0 : newIndex + panels;
                }

                if (typeof setCurrentIndex === "function") {
                    setCurrentIndex(newIndex);
                }

                clickCooldownRef.current = true;
                setTimeout(() => (clickCooldownRef.current = false), 300);
            })
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onMouseUp);
        return () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onMouseUp);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = 0;
                pendingRef.current = null;
            }
        };
    }, [computeCursorSide, currentIndex, layout, pages, panels, quality, setCurrentIndex]);

    // click handler: uses computeCursorSide to ensure click alignment with cursor
    const clickCooldownRef = useRef(false);



    if (!(chapterInfo && pages)) return null;
console.log(fullOCRCompleteData);

    return (
        <Suspense
            fallback={
                <div className="w-full flex flex-row justify-center items-center">
                    <Placeholder isDark={isDark} />
                </div>
            }
        >
            {/* Toasts portal - single mount here; the hook's showToast is stable */}
            <ToastsPortal isDark={isDark} />

            <div
                className={`flex  ${layout == "horizontal" ? cursorClass : ""} px-3 md:px-0 flex-1 ${layout === "horizontal"
                    ? "flex-row space-x-4 overflow-hidden justify-center mt-5 items-start"
                    : "flex-col space-y-4 mt-5 justify-end items-center"
                    } my-1`}
            >
                {isLoading ? (
                    <Placeholder isDark={isDark} />
                ) : layout === "horizontal" ? (
                    pages != undefined &&
                    (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data)
                        .slice(Math.abs(currentIndex), Math.abs(currentIndex + panels))
                        .map((page, index) => (
                            <div key={index} className="tracking-wider relative h-auto md:h-[87vh] flex justify-center items-center">
                                <div className={`relative w-auto max-h-screen md:h-[87vh]`}>
                                    <Image
                                        ref={imageRef}
                                        key={imageKey}
                                        src={page}
                                        alt={`Page ${currentIndex + index + 1}`}
                                        height={1680}
                                        width={1680}
                                        className={`object-contain border rounded-lg w-full h-full shadow-xl transition-all ${imageCache.includes(page) ? (isDark ? "border-gray-600" : "border-gray-300") : "hidden"
                                            }`}
                                        priority={index === 0}
                                        loading={index === 0 ? undefined : "eager"}
                                        onLoadingComplete={() => handleImageLoad(page)}
                                        onError={handleImageError}
                                        placeholder="blur"
                                        blurDataURL="./placeholder.jpg"
                                    />

                                    {!isLoadingOCR && chapterInfo?.translatedLanguage?.trim() !== "en" && showTranslationTextOverlay ? (
                                        <OCROverlay
                                            fullOCRResult={fullOCRResult}
                                            translatedTexts={translatedTexts}
                                            loading={false}
                                            ready={true}
                                            imageElement={imageRef.current}
                                            isDark={isDark}
                                        />
                                    ) : (
                                        ""
                                    )}

                                    {!imageCache.includes(page) && <Placeholder isDark={isDark} />}
                                </div>

                                {showTranslationAndSpeakingOptions && panels != 2 && (
                                    <div className="tracking-wider fixed flex flex-col justify-end items-end bottom-32 right-7">
                                        {!isLoadingOCR ? (
                                            <>
                                                {chapterInfo?.translatedLanguage?.trim() !== "en" && (
                                                    <button
                                                        disabled={panels === 2 || pageTranslations[page]}
                                                        onClick={() => handleUpload(page, "translate")}
                                                        className={`group py-2   ${panels === 2 || pageTranslations[page] ? "hidden" : ""} sm:py-4 px-1 sm:px-2 mb-4 before:bg-opacity-60 flex items-center justify-start min-w-[36px] sm:min-w-[48px] h-12 sm:h-20 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300  
    shadow-[0px_0px_10px_rgba(0,0,0,1)] shadow-yellow-500 ${isDark ? "bg-[#1a063e] bg-opacity-60" : "bg-yellow-200 bg-opacity-80"
                                                            } hover:min-w-[140px] sm:hover:min-w-[182px] hover:shadow-lg disabled:cursor-not-allowed 
    backdrop-blur-md lg:font-semibold border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 
    before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] 
    hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 ease-in-out`}
                                                    >
                                                        <Languages className={`tracking-wider w-10 h-10 sm:w-16 sm:h-16 p-2 sm:p-4 ${isDark ? "text-orange-400 bg-gray-50 bg-opacity-85 group-hover:border-2 group-hover:border-yellow-500" : "text-yellow-600 bg-gray-100 group-hover:border-2 group-hover:border-yellow-700"} transition-all ease-in-out duration-300 rounded-full border border-gray-700 transform group-hover:rotate-[360deg]`} />
                                                        <span className={`absolute font-sans font-bold left-14 sm:left-20 text-sm sm:text-lg tracking-tight ${isDark ? "text-black" : "text-yellow-900"} opacity-0 transform translate-x-2 sm:translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0`}>
                                                            {pageTranslations[page] ? "Translated" : "Translate"}
                                                        </span>
                                                    </button>
                                                )}

                                                <TextToSpeech
                                                    page={page}
                                                    handleUpload={handleUpload}
                                                    ready={Boolean(pageTranslations[page] || pageTTS[page])}
                                                    text={pageTranslations[page] ? pageTranslations[page]?.textResult : pageTTS[page]?.textResult}
                                                    layout={layout}
                                                    isDark={isDark}
                                                />
                                            </>
                                        ) : (
                                            <div className={`tracking-wider h-fit w-full flex justify-center items-center rounded-lg shadow-lg ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
                                                <div className="tracking-wider flex justify-center items-center w-full h-fit">
                                                    <div className="tracking-wider text-center flex flex-col justify-center items-center">
                                                        <div className={`tracking-wider spinner-border -mt-36 -ml-36 w-12 h-12 rounded-full animate-spin border-8 border-solid ${isDark ? "border-purple-500 border-t-transparent shadow-md" : "border-purple-700 border-t-transparent shadow-md"}`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {((pageTTS[page] && isItTextToSpeech) || pageTranslations[page]) && (pageTranslations[page] ? pageTranslations[page]?.textResult : pageTTS[page]?.textResult) && (
                                            <div>
                                                {showMessage ? (
                                                    <div className={`absolute z-50 text-wrap w-fit min-w-72 max-w-72 -top-[21rem] border-gray-500/30 border right-12 ${isDark ? "bg-black/95 text-white" : "bg-white text-gray-900"} p-4 rounded-lg shadow-lg transition-opacity duration-300`}>
                                                        <button className="absolute top-1 right-1 text-xs flex justify-center items-center text-white bg-purple-600/70 hover:bg-purple-700 rounded-full py-[7px] px-2.5" onClick={() => setShowMessage(false)}>✖</button>
                                                        <p className="text-sm tracking-widest lowercase">
                                                            {pageTranslations[page] ? pageTranslations[page]?.textResult : pageTTS[page]?.textResult || "No text Available"}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setShowMessage((prev) => !prev)} className={`absolute z-50 text-wrap w-fit -top-[21rem] border-gray-500/30 border -right-2 ${isDark ? "bg-black/95 text-white" : "bg-white text-gray-900"} p-3 rounded-xl shadow-lg transition-opacity duration-300 text-xs flex flex-row justify-center items-center gap-3`}>
                                                        <ScrollText className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                ) : (
                    <div className="w-full">
                        {pages &&
                            (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data).map((page, index) => (
                                <div key={index} className={`tracking-wider px-4 md:px-0 ${allAtOnce && (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data).map((p) => { if (!imageCache.includes(p)) return false; }).includes(false) ? "hidden" : "block"} relative h-fit w-full flex justify-center items-center`}>
                                    <div className="relative w-auto h-fit">
                                        <Image
                                            ref={imageRef}
                                            key={imageKey}
                                            src={page}
                                            alt={`Page ${index + 1}`}
                                            height={1680}
                                            width={1680}
                                            className={`object-contain border rounded-lg w-full max-w-[1280px] h-auto shadow-xl transition-all ${imageCache.includes(page) ? (isDark ? "border-gray-600" : "border-gray-300") : "hidden"}`}
                                            priority={index === 0}
                                            loading={index === 0 ? undefined : "eager"}
                                            onLoadingComplete={() => handleImageLoad(page)}
                                            onError={handleImageError}
                                            placeholder="blur"
                                            blurDataURL="./placeholder.jpg"
                                        />

                                        {!isLoadingOCR && chapterInfo?.translatedLanguage?.trim() !== "en" && showTranslationTextOverlay ? (
                                            <OCROverlay
                                                imageElement={imageRef.current}
                                                loading={overlayLoading}
                                                handleTranslate={memoizedHandleTranslate}
                                                ready={Boolean(pageTranslations[page]?.translatedocrResult)}
                                                translatedTexts={pageTranslations[page]?.translatedocrResult}
                                                fullOCRResult={pageTranslations[page]?.ocrResult}
                                                isDark={isDark}
                                            />
                                        ) : (
                                            ""
                                        )}
                                        {!imageCache.includes(page) && <Placeholder isDark={isDark} />}
                                    </div>

                                    {showTranslationAndSpeakingOptions && (
                                        <div className={`tracking-wider absolute top-[50%] transform space-y-4 flex flex-col justify-start items-end bottom-28 right-3`}>
                                            {!isLoadingOCR ? (
                                                <>
                                                    {chapterInfo?.translatedLanguage?.trim() !== "en" && (
                                                        <button disabled={panels === 2 || pageTranslations[page]} onClick={() => handleUpload(page, "translate")} className={`font-sans  ${(panels === 2 || pageTranslations[page]) ? "hidden" : ""} tracking-wider min-h-fit text-[11px] font-sans before:bg-opacity-60 min-w-[125px] sm:min-w-[189px] transition-colors flex gap-2 justify-start items-center mx-auto shadow-xl sm:text-lg backdrop-blur-md lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-2 py-1 sm:px-3 sm:py-2 ease-in-out overflow-hidden border-2 rounded-full group ${isDark ? "text-white bg-[#1a063e] backdrop-blur-md border-gray-50/50" : "text-gray-900 bg-yellow-200 border-yellow-300"} `} type="submit">
                                                            <Languages className={`tracking-wider w-8 h-8 sm:w-12 sm:h-12 group-hover:border-2 transition-all ease-in-out duration-300 rounded-full border p-2 sm:p-3 transform group-hover:rotate-[360deg] ${isDark ? "text-orange-400 bg-gray-50 border border-gray-700" : "text-yellow-600 bg-gray-100 border-yellow-700"}`} />
                                                            {pageTranslations[page] ? "Translated" : "Translate"}
                                                        </button>
                                                    )}
                                                    <TextToSpeech page={page} handleUpload={handleUpload} ready={Boolean(pageTranslations[page] || pageTTS[page])} text={pageTranslations[page] ? pageTranslations[page]?.textResult : pageTTS[page]?.textResult} layout={layout} isDark={isDark} />
                                                </>
                                            ) : (
                                                <div className={`tracking-wider h-fit w-full flex justify-center items-center rounded-lg shadow-lg ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
                                                    <div className="tracking-wider flex justify-center items-center w-full h-fit">
                                                        <div className="tracking-wider text-center flex flex-col justify-center items-center">
                                                            <div className={`tracking-wider spinner-border -mt-36 -ml-36 w-12 h-12 rounded-full animate-spin border-8 border-solid ${isDark ? "border-purple-500 border-t-transparent shadow-md" : "border-purple-700 border-t-transparent shadow-md"}`}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {((pageTTS[page] && isItTextToSpeech) || pageTranslations[page]) && (pageTranslations[page] ? pageTranslations[page]?.textResult : pageTTS[page]?.textResult) && (
                                                <div>
                                                    {showMessage ? (
                                                        <div className={`absolute z-50 text-wrap w-fit min-w-72 max-w-72 -top-[12rem] border-gray-500/30 border right-12 ${isDark ? "bg-black/95 text-white" : "bg-white text-gray-900"} p-4 rounded-lg shadow-lg transition-opacity duration-300`}>
                                                            <button className="absolute top-1 right-1 text-xs flex justify-center items-center text-white bg-purple-600/70 hover:bg-purple-700 rounded-full py-[7px] px-2.5" onClick={() => setShowMessage(false)}>✖</button>
                                                            <p className="text-sm tracking-widest lowercase">{pageTranslations[page] ? pageTranslations[page]?.textResult : pageTTS[page]?.textResult || "No text Available"}</p>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => setShowMessage((prev) => !prev)} className={`absolute z-50 text-wrap w-fit -top-[21rem] border-gray-500/30 border -right-2 ${isDark ? "bg-black/95 text-white" : "bg-white text-gray-900"} p-3 rounded-xl shadow-lg transition-opacity duration-300 text-xs flex flex-row justify-center items-center gap-3`}>
                                                            <ScrollText className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </Suspense>
    );
}

export default MiddleImageAndOptions;