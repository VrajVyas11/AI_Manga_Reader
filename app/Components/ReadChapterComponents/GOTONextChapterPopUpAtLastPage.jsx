import React, { useState, useEffect, useRef } from 'react'
import {
    ChevronRight,
    LaptopMinimalCheck
} from 'lucide-react'

function GOTONextChapterPopUpAtLastPage({
    isDark = true,
    onNext,
    autoAdvanceTime = 60
}) {
    const [timeLeft, setTimeLeft] = useState(autoAdvanceTime)
    const [isVisible, setIsVisible] = useState(false)
    const intervalRef = useRef(null)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 150)
        return () => clearTimeout(timer)
    }, [])

    // single interval controlling decrement
    useEffect(() => {
        if (timeLeft <= 0) return

        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0.1) {
                    // ensure we don't schedule handleNext repeatedly
                    clearInterval(intervalRef.current)
                    handleNext()
                    return 0
                }
                return Math.max(0, +(prev - 0.1).toFixed(1))
            })
        }, 100)

        return () => clearInterval(intervalRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // run once (interval handles time update)

    const progress = (timeLeft / autoAdvanceTime) * 100
    const circularProgress = (timeLeft / autoAdvanceTime) * 100

    const handleNext = () => {
        setIsVisible(false)
        setTimeout(() => onNext && onNext(), 250)
    }

    const handleClose = () => {
        setIsVisible(false)
    }

    const handleSkip = () => {
        clearInterval(intervalRef.current)
        setTimeLeft(0)
        handleNext()
    }

    return (
        <div
            className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300 ease-out
${isVisible ? "backdrop-blur-md" : " opacity-0"}
        ${isDark ? 'bg-black bg-opacity-85' : 'bg-white bg-opacity-95'}
      `}
        >
            <div
                className={`
          relative w-full max-w-md transform backdrop-blur-sm
          transition-all duration-300 ease-out
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-6'}
          ${isDark
                        ? 'bg-black border border-white/10'
                        : 'bg-white border border-black/10'
                    }
          rounded-3xl shadow-2xl overflow-hidden
        `}
            >
                {/* Progress bar */}
                <div className={`h-1 ${isDark ? 'bg-black/60' : 'bg-purple-800'} relative`}>
                    <div
                        className={`
              h-full transition-all duration-150 ease-out
              bg-white
            `}
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>

                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-5">
                        <div
                            className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                ${isDark ? 'bg-white/95 shadow-lg' : 'bg-black/95 shadow-lg'}
              `}
                        >
                            <LaptopMinimalCheck
                                size={24}
                                className={`${isDark ? 'text-black' : 'text-white'}`}
                            />
                        </div>

                        <div className="flex-1">
                            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                                Chapter Complete
                            </h2>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Ready for the next one?
                            </p>
                        </div>
                    </div>

                    {/* Auto-advance timer */}
                    <div
                        className={`
            flex items-center justify-between p-4 rounded-xl mb-5
            ${isDark ? 'bg-black/80 border border-white/10' : 'bg-white border border-black/10'}
          `}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`
                w-10 h-10 rounded-full flex items-center justify-center relative
              `}
                            >
                                {/* Circular progress */}
                                <svg className="absolute inset-0 w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                                    <circle
                                        cx="20"
                                        cy="20"
                                        r="17"
                                        fill="none"
                                        stroke={isDark ? '#111' : '#ddd'}
                                        strokeWidth="2"
                                    />
                                    <circle
                                        cx="20"
                                        cy="20"
                                        r="17"
                                        fill="none"
                                        stroke={isDark ? "#ffffff" : "000000"}
                                        strokeWidth="2"
                                        strokeDasharray={`${(circularProgress * 107) / 100} 107`}
                                        strokeLinecap="round"
                                        className="transition-all duration-100 stroke-purple-700"
                                    />
                                </svg>
                                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                                    {Math.ceil(timeLeft)}
                                </span>
                            </div>

                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                                    Auto-advancing
                                </p>
                                <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Next chapter in {Math.ceil(timeLeft)}s
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                e.nativeEvent?.stopImmediatePropagation();
                                handleSkip();
                            }}
                            className={`
                px-3 py-1 text-xs font-medium rounded-lg transition-all
                ${isDark
                                    ? 'text-white bg-white/10 hover:bg-white/12'
                                    : 'text-black bg-white/10 hover:bg-white/12'
                                }
              `}
                        >
                            Skip wait
                        </button>
                    </div>

                    {/* Action buttons - same row */}
                    <div className="flex gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                e.nativeEvent?.stopImmediatePropagation();
                                handleClose();
                            }}
                            className={`
                flex-1 p-3 rounded-xl font-semibold transition-all duration-200
                ${isDark
                                    ? ' text-white border border-white/40'
                                    : ' text-black border border-black/40'
                                }
                hover:scale-105 active:scale-95
              `}
                        >
                            Stay here
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                e.nativeEvent?.stopImmediatePropagation();
                                handleNext();
                            }}
                            className={`
                flex-1 flex items-center justify-center gap-2 p-3 rounded-xl font-semibold
                transition-all duration-200 group
                ${isDark ? "bg-purple-900/70" : "bg-black"} backdrop-blur-md text-white
                hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl
              `}
                        >
                            <span>Continue</span>
                            <ChevronRight
                                size={16}
                                className="group-hover:translate-x-0.5 transition-transform"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GOTONextChapterPopUpAtLastPage