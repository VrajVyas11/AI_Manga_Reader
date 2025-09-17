import React, { memo, useCallback, lazy, useState, useEffect, Suspense, useRef } from 'react';

import {
    Languages,
    ScrollText,
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
    isCollapsed,
    showTranslationTextOverlay,
    isDark = true, // Added isDark prop with default true
}) {
    const [cursorClass, setCursorClass] = useState('');
    const [imageCache, setImageCache] = useState([]);
    const [imageKey, setImageKey] = useState(0);
    const [isLoadingOCR, setIsLoadingOCR] = useState(false);
    const [translatedTexts, setTranslatedTexts] = useState({});
    const [overlayLoading, setOverlayLoading] = useState(false);
    const imageRef = useRef(null);
    const handleImageLoad = useCallback((url) => {
        setImageCache((prevCache) => [...prevCache, url]);
    }, []);

    const memoizedHandleTranslate = useCallback(
        (text) => handleTranslate(text),
        []
    );

    const handleImageError = useCallback(() => {
        setImageKey((prevKey) => prevKey + 1);
    }, []);

    const translateAll = useCallback(
        async (fullOCRResult) => {
            if (!fullOCRResult || fullOCRResult.length === 0) return;

            const needsTranslation = fullOCRResult.some(
                (item) => !translatedTexts[item.text] && item.text.trim() !== ''
            );

            if (!needsTranslation) return;

            setOverlayLoading(true);
            try {
                const newTranslations = { ...translatedTexts };
                const untranslatedItems = fullOCRResult.filter(
                    (item) => !translatedTexts[item.text] && item.text.trim() !== ''
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
                console.error('Error translating batch:', error);
            } finally {
                setOverlayLoading(false);
            }
        },
        [translatedTexts, memoizedHandleTranslate]
    );

    // Enhanced handleUpload function for MiddleImageAndOptions component
    const handleUpload = useCallback(
        async (imageUrl, from) => {
            if (!imageUrl) {
                console.error('❌ No image URL provided');
                return alert('No image found!');
            }

            console.log(`🔄 Starting ${from} operation for image: ${imageUrl}`);
            setIsLoadingOCR(true);

            try {
                // Fetch and convert image to file
                const response = await fetch(imageUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
                }

                const blob = await response.blob();
                console.log(`📁 Image blob size: ${blob.size} bytes, type: ${blob.type}`);

                const file = new File([blob], 'image.jpg', { type: blob.type });

                const formData = new FormData();
                formData.append('file', file);

                console.log('🚀 Sending OCR request...');
                const apiResponse = await fetch('/api/readTextAndReplace', {
                    method: 'POST',
                    body: formData,
                });

                console.log(`📡 API Response status: ${apiResponse.status}`);

                if (!apiResponse.ok) {
                    const errorText = await apiResponse.text();
                    console.error('❌ API Error Response:', errorText);
                    throw new Error(`API request failed: ${apiResponse.status} ${apiResponse.statusText}`);
                }

                const result = await apiResponse.json();
                console.log('📝 Full API Result:', JSON.stringify(result, null, 2));

                // Handle both old and new response formats
                let ocrResult = [];
                let processedText = '';
                let hasValidText = false;

                // Check for different response structures
                if (result.text && result.text.data && Array.isArray(result.text.data)) {
                    ocrResult = result.text.data;
                    processedText = ocrResult
                        .filter(item => item && item.text && item.text.trim())
                        .map(item => item.text.trim())
                        .join(' ');
                    hasValidText = processedText.length > 0;
                } else if (Array.isArray(result.text)) {
                    // Fallback for direct array response
                    ocrResult = result.text.map(item => ({
                        text: typeof item === 'string' ? item : (item.text || String(item)),
                        bbox: item.bbox || null,
                        confidence: item.confidence || 0
                    }));
                    processedText = ocrResult
                        .filter(item => item.text && item.text.trim())
                        .map(item => item.text.trim())
                        .join(' ');
                    hasValidText = processedText.length > 0;
                } else if (result.status === 'error') {
                    console.log('⚠️ OCR returned error status');
                    processedText = 'No Text Found';
                    hasValidText = false;
                } else {
                    console.warn('⚠️ Unexpected result format:', result);
                    processedText = 'Unexpected response format';
                    hasValidText = false;
                }

                console.log(`📖 Processed text (${processedText.length} chars):`, processedText.substring(0, 100) + (processedText.length > 100 ? '...' : ''));
                console.log(`✅ Has valid text: ${hasValidText}`);

                if (!hasValidText) {
                    console.log('ℹ️ No text detected in image');
                    alert('No text was detected in the image. Please try with a different image or check if the image contains clear text.');
                    return;
                }

                if (from === 'translate') {
                    console.log('🔄 Starting translation process...');
                    try {
                        const translated = await memoizedHandleTranslate(processedText);
                        console.log('🌐 Translation completed:', translated?.substring(0, 100) + (translated?.length > 100 ? '...' : ''));

                        const translatedocrResult = await translateAll(ocrResult);
                        console.log('🔄 Batch translation completed');

                        setPageTranslations((prev) => ({
                            ...prev,
                            [imageUrl]: {
                                ocrResult: ocrResult,
                                translatedocrResult: translatedocrResult,
                                textResult: translated,
                            },
                        }));
                        setIsItTextToSpeech(false);
                        console.log('✅ Translation data saved to state');
                    } catch (translateError) {
                        console.error('❌ Translation failed:', translateError);
                        alert('Text was extracted but translation failed. Please try again.');
                        return;
                    }
                } else if (from === 'speak') {
                    console.log('🔊 Setting up text for speech...');
                    setPageTTS((prev) => ({
                        ...prev,
                        [imageUrl]: {
                            ocrResult: ocrResult,
                            textResult: processedText,
                        },
                    }));
                    setFullOCRResult(ocrResult);
                    setIsItTextToSpeech(true);
                    console.log('✅ Speech data saved to state');
                }

                setShowMessage(true);
                console.log('✅ OCR operation completed successfully');

            } catch (error) {
                console.error('❌ OCR Operation Error:', error);
                console.error('❌ Error Stack:', error.stack);

                let errorMessage = 'Something went wrong with the OCR process!';

                if (error.message.includes('Failed to fetch image')) {
                    errorMessage = 'Could not load the image. Please try again.';
                } else if (error.message.includes('API request failed')) {
                    errorMessage = 'OCR service temporarily unavailable. Please try again in a moment.';
                } else if (error.message.includes('network')) {
                    errorMessage = 'Network error. Please check your connection and try again.';
                }

                alert(errorMessage);
            } finally {
                setIsLoadingOCR(false);
                console.log('🏁 OCR operation finished');
            }
        },
        [memoizedHandleTranslate, setFullOCRResult, setIsItTextToSpeech, setPageTTS, setPageTranslations, setShowMessage, translateAll]
    );

    useEffect(() => {
        if (layout === 'vertical') {
            setCursorClass('');
            return;
        }

        const handleMouseMove = (event) => {
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
    if (!(chapterInfo && pages)) return null;
    return (
        <Suspense
            fallback={
                <div className="w-full flex flex-row justify-center items-center">
                    <Placeholder isDark={isDark} />
                </div>
            }
        >
            <div
                className={`flex ${isCollapsed ? '' : 'ml-14 md:ml-0'
                    } ${layout == 'horizontal' ? cursorClass : ''} pl-3 md:px-0 flex-1 ${layout === 'horizontal'
                        ? 'flex-row space-x-4 overflow-hidden justify-center mt-5 items-start'
                        : 'flex-col space-y-4 mt-5 justify-end items-center'
                    } my-1`}
            >
                {isLoading ? (
                    <Placeholder isDark={isDark} />
                ) : layout === 'horizontal' ? (
                    pages != undefined &&
                    (quality === 'low'
                        ? pages?.chapter?.dataSaver
                        : pages?.chapter?.data
                    )
                        .slice(Math.abs(currentIndex), Math.abs(currentIndex + panels))
                        .map((page, index) => (
                            <div
                                key={index}
                                className="tracking-wider relative h-screen md:h-[87vh] flex justify-center items-center"
                            >
                                <div className={`relative w-auto max-h-screen md:h-[87vh]`}>
                                    <Image
                                        ref={imageRef}
                                        key={imageKey}
                                        src={page}
                                        alt={`Page ${currentIndex + index + 1}`}
                                        height={1680}
                                        width={1680}
                                        className={`object-contain border rounded-lg w-full h-full shadow-xl transition-all ${imageCache.includes(page)
                                            ? isDark
                                                ? 'border-gray-600'
                                                : 'border-gray-300'
                                            : 'hidden'
                                            }`}
                                        priority={index === 0}
                                        loading={index === 0 ? undefined : 'eager'}
                                        onLoadingComplete={() => handleImageLoad(page)}
                                        onError={handleImageError}
                                        placeholder="blur"
                                        blurDataURL="./placeholder.jpg"
                                    />
                                    {!isLoadingOCR &&
                                        chapterInfo?.translatedLanguage?.trim() !== 'en' &&
                                        showTranslationTextOverlay ? (
                                        <OCROverlay
                                            fullOCRResult={fullOCRResult}
                                            translatedTexts={translatedTexts}
                                            loading={false}
                                            ready={true}
                                            imageElement={imageRef.current}
                                            isDark={isDark}
                                        />
                                    ) : (
                                        ''
                                    )}
                                    {!imageCache.includes(page) && <Placeholder isDark={isDark} />}
                                </div>
                                {showTranslationAndSpeakingOptions &&
                                    panels != 2 && (
                                        <div className="tracking-wider fixed flex flex-col justify-end items-end bottom-32 right-7">
                                            {!isLoadingOCR ? (
                                                <>
                                                    {chapterInfo?.translatedLanguage?.trim() !== 'en' && (
                                                        <button
                                                            disabled={panels === 2 || pageTranslations[page]}
                                                            onClick={() => handleUpload(page, 'translate')}
                                                            className={`group py-2   ${panels === 2 || pageTranslations[page] ? "hidden" : ""} sm:py-4 px-1 sm:px-2 mb-4 before:bg-opacity-60 flex items-center justify-start min-w-[36px] sm:min-w-[48px] h-12 sm:h-20 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300  
    shadow-[0px_0px_10px_rgba(0,0,0,1)] shadow-yellow-500 ${isDark ? 'bg-[#1a063e] bg-opacity-60' : 'bg-yellow-200 bg-opacity-80'
                                                                } hover:min-w-[140px] sm:hover:min-w-[182px] hover:shadow-lg disabled:cursor-not-allowed 
    backdrop-blur-md lg:font-semibold border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 
    before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-[#FFFFFF] 
    hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 ease-in-out`}
                                                        >
                                                            <Languages
                                                                className={`tracking-wider w-10 h-10 sm:w-16 sm:h-16 p-2 sm:p-4 ${isDark
                                                                    ? 'text-orange-400 bg-gray-50 bg-opacity-85 group-hover:border-2 group-hover:border-yellow-500'
                                                                    : 'text-yellow-600 bg-gray-100 group-hover:border-2 group-hover:border-yellow-700'
                                                                    } transition-all ease-in-out duration-300 rounded-full border border-gray-700 transform group-hover:rotate-[360deg]`}
                                                            />
                                                            <span
                                                                className={`absolute font-sans font-bold left-14 sm:left-20 text-sm sm:text-lg tracking-tight ${isDark ? 'text-black' : 'text-yellow-900'
                                                                    } opacity-0 transform translate-x-2 sm:translate-x-4 transition-all duration-300 
      group-hover:opacity-100 group-hover:translate-x-0`}
                                                            >
                                                                {pageTranslations[page] ? 'Translated' : 'Translate'}
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
                                                <div
                                                    className={`tracking-wider h-fit w-full flex justify-center items-center rounded-lg shadow-lg ${isDark ? 'bg-gray-900' : 'bg-gray-100'
                                                        }`}
                                                >
                                                    <div className="tracking-wider flex justify-center items-center w-full h-fit">
                                                        <div className="tracking-wider text-center flex flex-col justify-center items-center">
                                                            <div
                                                                className={`tracking-wider spinner-border -mt-36 -ml-36 w-12 h-12 rounded-full animate-spin border-8 border-solid ${isDark
                                                                    ? 'border-purple-500 border-t-transparent shadow-md'
                                                                    : 'border-purple-700 border-t-transparent shadow-md'
                                                                    }`}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {((pageTTS[page] && isItTextToSpeech) || pageTranslations[page]) &&
                                                (pageTranslations[page]
                                                    ? pageTranslations[page]?.textResult
                                                    : pageTTS[page]?.textResult) && (
                                                    <div>
                                                        {showMessage ? (
                                                            <div
                                                                className={`absolute z-50 text-wrap w-fit min-w-72 max-w-72 -top-[21rem] border-gray-500/30 border right-12 ${isDark ? 'bg-black/95 text-white' : 'bg-white text-gray-900'
                                                                    } p-4 rounded-lg shadow-lg transition-opacity duration-300`}
                                                            >
                                                                <button
                                                                    className="absolute top-1 right-1 text-xs flex justify-center items-center text-white bg-purple-600/70 hover:bg-purple-700 rounded-full py-[7px] px-2.5"
                                                                    onClick={() => setShowMessage(false)}
                                                                >
                                                                    ✖
                                                                </button>
                                                                <p className="text-sm tracking-widest lowercase">
                                                                    {pageTranslations[page]
                                                                        ? pageTranslations[page]?.textResult
                                                                        : pageTTS[page]?.textResult || 'No text Available'}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setShowMessage((prev) => !prev)}
                                                                className={`absolute z-50 text-wrap w-fit -top-[21rem] border-gray-500/30 border -right-2 ${isDark ? 'bg-black/95 text-white' : 'bg-white text-gray-900'
                                                                    } p-3 rounded-xl shadow-lg transition-opacity duration-300 text-xs flex flex-row justify-center items-center gap-3`}
                                                            >
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
                            (quality === 'low'
                                ? pages?.chapter?.dataSaver
                                : pages?.chapter?.data
                            ).map((page, index) => (
                                <div
                                    key={index}
                                    className={`tracking-wider px-4 md:px-0 ${allAtOnce &&
                                        (quality === 'low'
                                            ? pages?.chapter?.dataSaver
                                            : pages?.chapter?.data
                                        )
                                            .map((p) => {
                                                if (!imageCache.includes(p)) return false;
                                            })
                                            .includes(false)
                                        ? 'hidden'
                                        : 'block'
                                        } relative h-fit w-full flex justify-center items-center`}
                                >
                                    <div className="relative w-auto h-fit">
                                        <Image
                                            ref={imageRef}
                                            key={imageKey}
                                            src={page}
                                            alt={`Page ${index + 1}`}
                                            height={1680}
                                            width={1680}
                                            className={`object-contain border rounded-lg w-full max-w-[1280px] h-auto shadow-xl transition-all ${imageCache.includes(page)
                                                ? isDark
                                                    ? 'border-gray-600'
                                                    : 'border-gray-300'
                                                : 'hidden'
                                                }`}
                                            priority={index === 0}
                                            loading={index === 0 ? undefined : 'eager'}
                                            onLoadingComplete={() => handleImageLoad(page)}
                                            onError={handleImageError}
                                            placeholder="blur"
                                            blurDataURL="./placeholder.jpg"
                                        />
                                        {!isLoadingOCR &&
                                            chapterInfo?.translatedLanguage?.trim() !== 'en' &&
                                            showTranslationTextOverlay ? (
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
                                            ''
                                        )}
                                        {!imageCache.includes(page) && <Placeholder isDark={isDark} />}
                                    </div>
                                    {showTranslationAndSpeakingOptions && (
                                        <div className={`tracking-wider absolute top-[50%] transform space-y-4 flex flex-col justify-start items-end bottom-28 right-3`}>
                                            {!isLoadingOCR ? (
                                                <>
                                                    {chapterInfo?.translatedLanguage?.trim() !== 'en' && (
                                                        <button
                                                            disabled={panels === 2 || pageTranslations[page]}
                                                            onClick={() => handleUpload(page, 'translate')}
                                                            className={`font-sans  ${(panels === 2 || pageTranslations[page]) ? "hidden" : ""} tracking-wider min-h-fit text-[11px] font-sans before:bg-opacity-60 min-w-[125px] sm:min-w-[189px] transition-colors flex gap-2 justify-start items-center mx-auto shadow-xl sm:text-lg backdrop-blur-md lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-2 py-1 sm:px-3 sm:py-2 ease-in-out overflow-hidden border-2 rounded-full group 
                                                             ${isDark
                                                                    ? 'text-white bg-[#1a063e] backdrop-blur-md border-gray-50/50'
                                                                    : 'text-gray-900 bg-yellow-200 border-yellow-300'
                                                                } `}
                                                            type="submit"
                                                        >
                                                            <Languages
                                                                className={`tracking-wider w-8 h-8 sm:w-12 sm:h-12 group-hover:border-2 transition-all ease-in-out duration-300 rounded-full border p-2 sm:p-3 transform group-hover:rotate-[360deg] ${isDark
                                                                    ? 'text-orange-400 bg-gray-50 border border-gray-700'
                                                                    : 'text-yellow-600 bg-gray-100 border-yellow-700'
                                                                    } `}
                                                            />
                                                            {pageTranslations[page] ? 'Translated' : 'Translate'}
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
                                                <div
                                                    className={`tracking-wider h-fit w-full flex justify-center items-center rounded-lg shadow-lg ${isDark ? 'bg-gray-900' : 'bg-gray-100'
                                                        }`}
                                                >
                                                    <div className="tracking-wider flex justify-center items-center w-full h-fit">
                                                        <div className="tracking-wider text-center flex flex-col justify-center items-center">
                                                            <div
                                                                className={`tracking-wider spinner-border -mt-36 -ml-36 w-12 h-12 rounded-full animate-spin border-8 border-solid ${isDark
                                                                    ? 'border-purple-500 border-t-transparent shadow-md'
                                                                    : 'border-purple-700 border-t-transparent shadow-md'
                                                                    }`}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {((pageTTS[page] && isItTextToSpeech) || pageTranslations[page]) &&
                                                (pageTranslations[page]
                                                    ? pageTranslations[page]?.textResult
                                                    : pageTTS[page]?.textResult) && (
                                                    <div>
                                                        {showMessage ? (
                                                            <div
                                                                className={`absolute z-50 text-wrap w-fit min-w-72 max-w-72 -top-[12rem] border-gray-500/30 border right-12 ${isDark ? 'bg-black/95 text-white' : 'bg-white text-gray-900'
                                                                    } p-4 rounded-lg shadow-lg transition-opacity duration-300`}
                                                            >
                                                                <button
                                                                    className="absolute top-1 right-1 text-xs flex justify-center items-center text-white bg-purple-600/70 hover:bg-purple-700 rounded-full py-[7px] px-2.5"
                                                                    onClick={() => setShowMessage(false)}
                                                                >
                                                                    ✖
                                                                </button>
                                                                <p className="text-sm tracking-widest lowercase">
                                                                    {pageTranslations[page]
                                                                        ? pageTranslations[page]?.textResult
                                                                        : pageTTS[page]?.textResult || 'No text Available'}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setShowMessage((prev) => !prev)}
                                                                className={`absolute z-50 text-wrap w-fit -top-[21rem] border-gray-500/30 border -right-2 ${isDark ? 'bg-black/95 text-white' : 'bg-white text-gray-900'
                                                                    } p-3 rounded-xl shadow-lg transition-opacity duration-300 text-xs flex flex-row justify-center items-center gap-3`}
                                                            >
                                                                <ScrollText className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>)}
            </div>
        </Suspense>
    );
}

export default MiddleImageAndOptions;