import React, { useCallback, useEffect } from 'react';

function BottomPagesNavigation({
    setCurrentIndex,
    currentIndex,
    layout,
    panels,
    pages
}) {
    const handlePrev = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            panels === 2 ? prevIndex === 0 || prevIndex === 1 : prevIndex === 0 ? Math.max(0, pages.length - panels) : prevIndex - panels
        );
    }, [setCurrentIndex, panels, pages]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex + panels >= pages.length ? 0 : prevIndex + panels
        );
    }, [setCurrentIndex, panels, pages]);

    const handleTabClick = (pageIndex) => {
        console.log(pageIndex)
        setCurrentIndex(pageIndex);
        console.log(currentIndex); 
    };
console.log(currentIndex);
    // Handle screen clicks
    useEffect(() => {
        const handleScreenClick = (event) => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const clickX = event.clientX;
            const clickY = event.clientY;

            // Check if click is in top area (skip navigation)
            if (clickY < screenHeight / 5.5) return;
            if (clickY > screenHeight * 0.9) return;
            // console.log("this just got triggered",(clickY > screenHeight * 0.9))
            // Calculate the middle 500px area
            const middleStart = (screenWidth - 600) / 2;
            const middleEnd = middleStart + 600;

            // Only proceed if click is within the middle 500px area
            if (clickX < middleStart || clickX > middleEnd) return;

            // Check if click is on left half or right half of the middle area
            const middlePoint = screenWidth / 2;
            if (clickX < middlePoint) {
                handlePrev();
            } else {
                handleNext();
            }
        };


        // Add click listener to the entire document
        document.addEventListener('click', handleScreenClick);
        // Cleanup
        return () => {
            document.removeEventListener('click', handleScreenClick);
        };
    }, [handlePrev, handleNext]);



    useEffect(() => {
        const handleRightLeftKeyPressed = (event) => {
            const keypressed = event.key;
            // console.log("the key pressed was", event);
            if (keypressed === "ArrowLeft") {
                handlePrev();
            } else if (keypressed === "ArrowRight") {
                handleNext();
            }
        };

        document.addEventListener('keyup', handleRightLeftKeyPressed);

        // Cleanup: Remove the event listener
        return () => {
            document.removeEventListener('keyup', handleRightLeftKeyPressed);
        };
    }, [handlePrev, handleNext]);

    return (
        layout == "horizontal" ? <div className='bg-transparent h-fit w-full'>
            {/* Page counter */}
            <div className="mb-4 ml-5 font-bold   absolute bottom-0">
                <span className="text-base sm:text-sm text-gray-300">
                    {currentIndex + 1}
                    {panels === 2 && "-" + Math.min(currentIndex + panels, pages.length)} / {pages.length}
                </span>
            </div>

            {/* Bottom tabs */}
            <div className="flex group gap-1 w-full justify-center">
                {pages.map((_, index) => {
                    // Determine if this tab should be active
                    const isActive = panels === 2
                        ? index >= currentIndex && index < currentIndex + panels
                        : index === currentIndex;

                    return (
                        <button
                            key={index}
                            onClick={(e) => {
                                console.log(index)
                                e.stopPropagation(); // Prevent triggering screen click
                                handleTabClick(index);
                            }}
                            className={`h-1.5 group-hover:h-3 hover:duration-500 group-hover:transform group-hover:ease-in-out group-hover:transition-all w-[25%] rounded-sm transition-colors duration-200 ${isActive
                                ? 'bg-purple-800 hover:bg-purple-700'
                                : 'bg-white/20 backdrop-blur-md hover:bg-white/30'
                                }`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    );
                })}
            </div>

            {/* Instructions */}
            {/* <div className="mt-2 text-center">
                <span className="text-xs text-gray-400">
                    Click left/right side of screen or tabs to navigate
                </span>
            </div> */}
        </div> : null
    );
}

export default BottomPagesNavigation;