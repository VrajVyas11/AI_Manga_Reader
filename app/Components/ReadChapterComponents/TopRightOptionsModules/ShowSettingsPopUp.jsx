import React from 'react'
import { X, Languages, Layers2, Sparkles, LayoutDashboard } from 'lucide-react'

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
    setShowTranslationAndSpeakingOptions
}) {
    return (
        <div className="bg-black/95 border tracking-wider absolute top-12 -left-12 border-white/10 rounded-2xl p-3 px-5 pb-5 min-w-[259px] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold">Settings</h3>
                <button
                    onClick={toggleSettings}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-5">
                {/* Layout Direction */}
                <div>
                    <label className="flex flex-row gap-1.5 justify-start items-center text-sm font-medium text-white mb-2">
                        <LayoutDashboard className='w-4 h-4' />  Layout Direction
                    </label>
                    <div className="flex gap-2">
                        {['vertical', 'horizontal'].map((option) => (
                            <button
                                key={option}
                                onClick={() => setLayout(option)}
                                className={`flex-1 py-1.5 px-2 text-[10px] rounded border font-semibold transition-colors  ${layout === option
                                    ? 'bg-purple-500/30 border-purple-500/50 text-white'
                                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                    }`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image Quality */}
                <div>
                    <label className="flex flex-row gap-1.5 justify-start items-center text-sm font-medium text-white mb-2">
                        <Sparkles className='w-4 h-4' />  Image Quality
                    </label>
                    <div className="flex gap-2">
                        {['low', 'high'].map((option) => (
                            <button
                                key={option}
                                onClick={() => setQuality(option)}
                                className={`flex-1 py-1.5 px-2 text-[10px] rounded border font-semibold transition-colors  ${quality === option
                                    ? 'bg-purple-500/30 border-purple-500/50 text-white'
                                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
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
                        <label className="flex flex-row gap-1.5 justify-start items-center text-sm font-medium text-white mb-2">
                            <Layers2 className='w-4 h-4' />  Panel Layout
                        </label>
                        <div className="flex gap-2">
                            {[
                                { value: 1, label: 'Single' },
                                { value: 2, label: 'Double' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setPanels(option.value)}
                                    className={`flex-1 py-1.5 px-2 text-[10px] rounded border font-semibold transition-colors ${panels === option.value
                                        ? 'bg-purple-500/30 border-purple-500/50 text-white'
                                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
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
                        <label className="flex flex-row gap-1.5 justify-start items-center text-sm font-medium text-white mb-2">
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
                                    className={`flex-1 py-1.5 px-2 text-[10px] rounded border font-semibold transition-colors  ${allAtOnce === option.value
                                        ? 'bg-purple-500/30 border-purple-500/50 text-white'
                                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Exclusive Translation & Speaking Toggle */}
                <div className="mt-4">
                    <label className="flex flex-row gap-1.5 justify-start items-center text-sm font-medium text-white mb-2">
                        <Languages className='w-4 h-4' />  Translation & Speaking
                    </label>

                    <div className="flex gap-2">
                        {[true, false].map((option) => (
                            <button
                                key={option.toString()}
                                onClick={() => setShowTranslationAndSpeakingOptions(option)}
                                className={`flex-1 py-1.5 px-2 text-[10px] rounded border font-semibold transition-colors ${showTranslationAndSpeakingOptions === option
                                    ? 'bg-yellow-400 text-yellow-900 border-yellow-400'
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

export default React.memo(ShowSettingsPopUp)