// ShowSettingsPopUp.jsx
import React from 'react'
import { X, Languages, Layers2, Sparkles, LayoutDashboard, BookCopy } from 'lucide-react'

function ShowSettingsPopUp({
    toggleSettings,
    setLayout,
    layout,
    panels,
    setPanels,
    allAtOnce,
    setAllAtOnce,
    setQuality,
    quality,
    showTranslationAndSpeakingOptions,
    setShowTranslationAndSpeakingOptions,
    chapterInfo,
    showTranslationTextOverlay,
    setShowTranslationTextOverlay,
    isDark = true
}) {
    return (
        <div className={`border tracking-wider absolute top-12 -left-12 rounded-2xl p-3 px-5 pb-5 min-w-[259px] backdrop-blur-xl ${
            isDark 
                ? "bg-black/95 border-white/10" 
                : "bg-white/95 border-gray-300"
        }`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className={`font-semibold ${
                    isDark ? "text-white" : "text-gray-800"
                }`}>Settings</h3>
                <button
                    onClick={toggleSettings}
                    className={`transition-colors ${
                        isDark 
                            ? "text-gray-400 hover:text-white" 
                            : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-5">
                {/* Layout Direction */}
                <div>
                    <label className={`flex flex-row gap-1.5 justify-start items-center text-sm font-medium mb-2 ${
                        isDark ? "text-white" : "text-gray-800"
                    }`}>
                        <LayoutDashboard className='w-4 h-4' /> Layout Direction
                    </label>
                    <div className="flex gap-2">
                        {['vertical', 'horizontal'].map((option) => (
                            <button
                                key={option}
                                onClick={() => setLayout(option)}
                                className={`flex-1 py-1.5 px-2 text-[10px] rounded border font-semibold transition-colors ${
                                    layout === option
                                        ? isDark 
                                            ? 'bg-purple-500/30 border-purple-500/50 text-white'
                                            : 'bg-purple-500/30 border-purple-500/50 text-black'
                                        : isDark 
                                            ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                            : 'bg-gray-100/50 border-gray-300/30 text-gray-700 hover:bg-gray-200/50'
                                }`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image Quality */}
                <div>
                    <label className={`flex flex-row gap-1.5 justify-start items-center text-sm font-medium mb-2 ${
                        isDark ? "text-white" : "text-gray-800"
                    }`}>
                        <Sparkles className='w-4 h-4' /> Image Quality
                    </label>
                    <div className="flex gap-2">
                        {['low', 'high'].map((option) => (
                            <button
                                key={option}
                                onClick={() => setQuality(option)}
                                className={`flex-1 py-1.5 px-2 text-[10px] rounded border font-semibold transition-colors ${
                                    quality === option
                                        ? isDark 
                                            ? 'bg-purple-500/30 border-purple-500/50 text-white'
                                            : 'bg-purple-500/30 border-purple-500/50 text-black'
                                        : isDark 
                                            ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                            : 'bg-gray-100/50 border-gray-300/30 text-gray-700 hover:bg-gray-200/50'
                                }`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Panel Toggle - Only show when layout is horizontal */}
                {layout === 'horizontal' && (
                    <div>
                        <label className={`flex flex-row gap-1.5 justify-start items-center text-sm font-medium mb-2 ${
                            isDark ? "text-white" : "text-gray-800"
                        }`}>
                            <Layers2 className='w-4 h-4' /> Panel Layout
                        </label>
                        <div className="flex gap-2">
                            {[
                                { value: 1, label: 'Single' },
                                { value: 2, label: 'Double' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setPanels(option.value)}
                                    className={`flex-1 py-1.5 px-2 text-[10px] rounded border font-semibold transition-colors ${
                                        panels === option.value
                                            ? isDark 
                                                ? 'bg-purple-500/30 border-purple-500/50 text-white'
                                                : 'bg-purple-500/30 border-purple-500/50 text-black'
                                            : isDark 
                                                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                                : 'bg-gray-100/50 border-gray-300/30 text-gray-700 hover:bg-gray-200/50'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Page Loading - Only show when layout is vertical */}
                {layout === 'vertical' && (
                    <div>
                        <label className={`flex flex-row gap-1.5 justify-start items-center text-sm font-medium mb-2 ${
                            isDark ? "text-white" : "text-gray-800"
                        }`}>
                            Page Loading
                        </label>
                        <div className="flex gap-2">
                            {[
                                { value: true, label: 'All at Once' },
                                { value: false, label: 'One by One' }
                            ].map((option) => (
                                <button
                                    key={option.value.toString()}
                                    onClick={() => setAllAtOnce(option.value)}
                                    className={`flex-1 py-1.5 px-2 text-[10px] rounded border font-semibold transition-colors ${
                                        allAtOnce === option.value
                                            ? isDark 
                                                ? 'bg-purple-500/30 border-purple-500/50 text-white'
                                                : 'bg-purple-500/30 border-purple-500/50 text-black'
                                            : isDark 
                                                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                                : 'bg-gray-100/50 border-gray-300/30 text-gray-700 hover:bg-gray-200/50'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Show Overlay Toggle Button */}
                {chapterInfo.translatedLanguage != "en" && (
                    <div className="mt-4">
                        <label className={`flex flex-row gap-1.5 justify-start items-center text-sm font-medium mb-2 ${
                            isDark ? "text-white" : "text-gray-800"
                        }`}>
                            <BookCopy className='w-4 h-4' /> Translation Overlay
                        </label>
                        <div className="flex gap-2">
                            {[true, false].map((option) => (
                                <button
                                    key={option.toString()}
                                    onClick={() => setShowTranslationTextOverlay(option)}
                                    className={`flex-1 py-1.5 px-2 text-[10px] rounded border font-semibold transition-colors ${
                                        showTranslationTextOverlay === option
                                            ? isDark 
                                                ? 'bg-purple-500/30 border-purple-500/50 text-white'
                                                : 'bg-purple-500/30 border-purple-500/50 text-black'
                                            : isDark 
                                                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                                : 'bg-gray-100/50 border-gray-300/30 text-gray-700 hover:bg-gray-200/50'
                                    }`}
                                    aria-pressed={showTranslationTextOverlay === option}
                                    title={option ? 'Enable Translation & Speaking' : 'Disable Translation & Speaking'}
                                >
                                    {option ? 'Enable' : 'Disable'}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Exclusive Translation & Speaking Toggle */}
                <div className="mt-4">
                    <label className={`flex flex-row gap-1.5 justify-start items-center text-sm font-medium mb-2 ${
                        isDark ? "text-white" : "text-gray-800"
                    }`}>
                        <Languages className='w-4 h-4' /> Translation & Speaking
                    </label>
                    <div className="flex gap-2">
                        {[true, false].map((option) => (
                            <button
                                key={option.toString()}
                                onClick={() => setShowTranslationAndSpeakingOptions(option)}
                                className={`flex-1 py-1.5 px-2 text-[10px] rounded border font-semibold transition-colors ${
                                    showTranslationAndSpeakingOptions === option
                                        ? isDark || !isDark // Same for both themes as it's a special yellow accent
                                            ? 'bg-yellow-400 text-yellow-900 border-yellow-400'
                                            : 'bg-yellow-400 text-yellow-900 border-yellow-400'
                                        : isDark || !isDark // Same for both themes as it's a special yellow accent
                                            ? 'bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400/20'
                                            : 'bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400/20'
                                }`}
                                aria-pressed={showTranslationAndSpeakingOptions === option}
                                title={option ? 'Enable Translation & Speaking' : 'Disable Translation & Speaking'}
                            >
                                {option ? 'Enable' : 'Disable'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(ShowSettingsPopUp);