import React, { useCallback, memo } from 'react';
import Image from 'next/image';
import LayoutSelector from "./LayoutSelector";
import QualitySelector from "./QualitySelector"
const BottomSettings = ({
  setLayout,
  setCurrentIndex,
  layout,
  currentIndex,
  panels,
  pages,
  setPanels,
  allAtOnce,
  setAllAtOnce,
  setQuality,
  quality
}) => {
  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, pages.length - panels) : prevIndex - panels
    );
  }, [setCurrentIndex, panels, pages]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + panels >= pages.length ? 0 : prevIndex + panels
    );
  }, [setCurrentIndex, panels, pages]);

  return (
    layout === "horizontal" ? (
      <div className="relative w-auto h-24 bg-[#070920] bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 backdrop-blur-md shadow-xl border-t border-blue-950">
        <div className="flex w-full items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <LayoutSelector layout={layout} setLayout={setLayout} />

            <QualitySelector quality={quality} setQuality={setQuality} />
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={handlePrev}
              className={`flex items-center tracking-wider justify-center w-fit gap-4 px-6 py-4 text-xs font-medium text-gray-100 bg-gradient-to-b from-[#1a1a2e] to-[#141426] rounded-lg border border-violet-900/50 hover:shadow-purple-400 shadow-purple-400 focus:outline-none transition-all duration-300 shadow-[0_0_5px_rgba(139,92,246,0.9)]  hover:shadow-[0_0_10px_rgba(139,92,246,0.4)]`}
            >
              <Image className="brightness-200" src="/previous.svg" alt="prev" width={20} height={20} />Prev
            </button>

            <span className="text-sm text-gray-300">
              {currentIndex + 1}
              {panels === 2 && "-" + Math.min(currentIndex + panels, pages.length)} / {pages.length}
            </span>

            <button
              onClick={handleNext}
              className={`flex items-center tracking-wider justify-center w-fit gap-4 px-6 py-4 text-xs font-medium text-gray-100 bg-gradient-to-b from-[#1a1a2e] to-[#141426] rounded-lg border border-violet-900/50 hover:shadow-purple-400 shadow-purple-400 focus:outline-none transition-all duration-300 shadow-[0_0_5px_rgba(139,92,246,0.9)]  hover:shadow-[0_0_10px_rgba(139,92,246,0.4)]`}
            >
              Next
              <Image className="brightness-200" src="/next.svg" alt="next" width={20} height={20} />
            </button>
          </div>

          <div className="relative grid grid-cols-2 bg-[#1a1a2e] rounded-full py-2.5 px-2 shadow-lg shadow-black/50 select-none">
            {/* Sliding indicator */}
            <div
              className={`absolute top-1 bottom-1 w-14 rounded-full bg-purple-400/30 border-2 border-purple-400 s shadow-purple-500  transition-transform duration-300 ease-in-out ${panels === 1 ? "translate-x-2" : "translate-x-16"
                }`}
            />
            {/* Buttons */}
            <button
              onClick={() => setPanels(1)}
              className={`relative col-span-1 z-10 flex items-center justify-center w-14 h-10 rounded-full text-sm font-semibold cursor-pointer transition-colors duration-300 ${panels === 1 ? "text-black" : "text-white hover:text-orange-400"
                }`}
              aria-pressed={panels === 1}
              aria-label="Single Panel"
            >
              <Image
                height={300}
                width={300}
                src="/single.svg"
                alt="Single Panel"
                className="w-5 h-5 brightness-200"
                draggable={false}
              />
            </button>
            <button
              onClick={() => setPanels(2)}
              className={`relative z-10 col-span-1 flex items-center justify-center w-14 h-10 rounded-full text-sm font-semibold cursor-pointer transition-colors duration-300 ${panels === 2 ? "text-black" : "text-white hover:text-orange-400"
                }`}
              aria-pressed={panels === 2}
              aria-label="Double Panel"
            >
              <Image
                height={300}
                width={300}
                src="/double.svg"
                alt="Double Panel"
                className="w-5 h-5 brightness-200"
                draggable={false}
              />
            </button>
          </div>

        </div>
      </div>
    ) : (
      <div className="w-[77.5%] h-24 fixed bottom-0 bg-[#070920] flex items-center justify-between px-6 py-4 backdrop-blur-md shadow-xl border-t border-blue-950">
         <div className="flex w-full items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <LayoutSelector layout={layout} setLayout={setLayout} />

            <QualitySelector quality={quality} setQuality={setQuality} />
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={handlePrev}
              className={`flex items-center tracking-wider justify-center w-fit gap-4 px-6 py-4 text-xs font-medium text-gray-100 bg-gradient-to-b from-[#1a1a2e] to-[#141426] rounded-lg border border-violet-900/50 hover:shadow-purple-400 shadow-purple-400 focus:outline-none transition-all duration-300 shadow-[0_0_5px_rgba(139,92,246,0.9)]  hover:shadow-[0_0_10px_rgba(139,92,246,0.4)]`}
            >
              <Image className="brightness-200" src="/previous.svg" alt="prev" width={20} height={20} />Prev
            </button>

            <span className="text-sm text-gray-300">
              {currentIndex + 1}
              {panels === 2 && "-" + Math.min(currentIndex + panels, pages.length)} / {pages.length}
            </span>

            <button
              onClick={handleNext}
              className={`flex items-center tracking-wider justify-center w-fit gap-4 px-6 py-4 text-xs font-medium text-gray-100 bg-gradient-to-b from-[#1a1a2e] to-[#141426] rounded-lg border border-violet-900/50 hover:shadow-purple-400 shadow-purple-400 focus:outline-none transition-all duration-300 shadow-[0_0_5px_rgba(139,92,246,0.9)]  hover:shadow-[0_0_10px_rgba(139,92,246,0.4)]`}
            >
              Next
              <Image className="brightness-200" src="/next.svg" alt="next" width={20} height={20} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAllAtOnce(true)}
              className={`relative min-w-36 p-4 text-white rounded-md bg-gradient-to-b from-gray-700 to-gray-800 shadow-lg hover:shadow-xl focus:outline-none transition-all duration-300
              ${allAtOnce
                  ? 'border-b-2 border-violet-500 before:absolute before:inset-0 before:bg-violet-600/30 before:rounded-md before:scale-100'
                  : 'hover:border-b-2 hover:border-violet-400 before:absolute before:inset-0 before:bg-violet-400/20 before:rounded-md before:scale-0 hover:before:scale-100'
                } before:transition-transform before:duration-300`}
            >
              All
            </button>

            <button
              onClick={() => setAllAtOnce(false)}
              className={`relative p-4 min-w-36 text-white rounded-md bg-gradient-to-b from-gray-700 to-gray-800 shadow-lg hover:shadow-xl focus:outline-none transition-all duration-300
              ${!allAtOnce
                  ? 'border-b-2 border-violet-500 before:absolute before:inset-0 before:bg-violet-600/30 before:rounded-md before:scale-100'
                  : 'hover:border-b-2 hover:border-violet-400 before:absolute before:inset-0 before:bg-violet-400/20 before:rounded-md before:scale-0 hover:before:scale-100'
                } before:transition-transform before:duration-300`}
            >
              By One
            </button>
          </div>
          <div className="relative grid grid-cols-2 bg-[#1a1a2e] rounded-full py-2.5 px-2 shadow-lg shadow-black/50 select-none">
            {/* Sliding indicator */}
            <div
              className={`absolute top-1 bottom-1 w-14 rounded-full bg-purple-400/30 border-2 border-purple-400 s shadow-purple-500  transition-transform duration-300 ease-in-out ${panels === 1 ? "translate-x-2" : "translate-x-16"
                }`}
            />
            {/* Buttons */}
            <button
              onClick={() => setPanels(1)}
              className={`relative col-span-1 z-10 flex items-center justify-center w-14 h-10 rounded-full text-sm font-semibold cursor-pointer transition-colors duration-300 ${panels === 1 ? "text-black" : "text-white hover:text-orange-400"
                }`}
              aria-pressed={panels === 1}
              aria-label="Single Panel"
            >
              <Image
                height={300}
                width={300}
                src="/single.svg"
                alt="Single Panel"
                className="w-5 h-5 brightness-200"
                draggable={false}
              />
            </button>
            <button
              onClick={() => setPanels(2)}
              className={`relative z-10 col-span-1 flex items-center justify-center w-14 h-10 rounded-full text-sm font-semibold cursor-pointer transition-colors duration-300 ${panels === 2 ? "text-black" : "text-white hover:text-orange-400"
                }`}
              aria-pressed={panels === 2}
              aria-label="Double Panel"
            >
              <Image
                height={300}
                width={300}
                src="/double.svg"
                alt="Double Panel"
                className="w-5 h-5 brightness-200"
                draggable={false}
              />
            </button>
          </div>

        </div>
      </div>
    )
  );
}

export default BottomSettings;
