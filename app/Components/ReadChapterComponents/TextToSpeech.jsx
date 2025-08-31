"use client";

import { AudioLines, Settings, Square } from "lucide-react";
import { useCallback, useState, useEffect } from "react";

const TextToSpeech = ({ text, handleUpload, page, ready, layout = "horizontal", isDark = true }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis
        .getVoices()
        .filter((voice) => voice.lang.includes("en"));
      if (availableVoices.length) {
        setVoices(availableVoices);
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = useCallback(() => {
    if (!text?.trim()) {
      return window.toast
        ? window.toast.error("No text to speak")
        : alert("No text to speak");
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synth.cancel();
    synth.speak(utterance);
  }, [text, selectedVoice, rate]);

  const handleStop = useCallback(() => {
    try {
      window.speechSynthesis.cancel();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const toggleControls = useCallback(() => {
    setShowControls((prev) => !prev);
  }, []);

  const renderButton = () => {
    if (!ready) {
      return layout !== "vertical" ? (
        <button
          onClick={() => handleUpload(page, "speak")}
          disabled={isSpeaking}
          className={`group py-2 px-0.5 md:px-1.5 before:bg-opacity-60 flex items-center justify-start min-w-[36px] sm:min-w-[48px] h-12 sm:h-20 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300 shadow-[0px_0px_10px_rgba(0,0,0,1)] hover:min-w-[140px] sm:hover:min-w-[189px] hover:shadow-lg disabled:cursor-not-allowed backdrop-blur-md lg:font-semibold before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 z-10 ease-in-out ${isDark
              ? "text-gray-100 shadow-violet-500 bg-[#2f0a6e] border-2 border-violet-800 before:bg-[#FFFFFF] hover:text-black"
              : "text-black shadow-purple-600 bg-violet-300 border-2 border-purple-300 before:bg-purple-100 hover:text-white"
            }`}
        >
          <AudioLines
            className={`tracking-wider w-10 h-10 sm:w-16 sm:h-16 group-hover:border-2 transition-all ease-in-out duration-300 rounded-full border p-2 sm:p-3 transform group-hover:rotate-[360deg] ${isDark
                ? "group-hover:border-violet-500 bg-gray-50 text-purple-800 border-gray-700"
                : "group-hover:border-purple-500 bg-gray-50 text-purple-600 border-purple-400"
              }`}
          />
          <span
            className={`absolute font-sans font-bold left-12 sm:left-20 text-[11px] sm:text-lg tracking-tight opacity-0 transform translate-x-2 sm:translate-x-4 transition-all duration-300 group-hover:opacity-100 whitespace-nowrap group-hover:translate-x-0 ${isDark
                ? "text-gray-100 group-hover:text-black"
                : "text-gray-800 group-hover:text-black"
              }`}
          >
            Read Aloud
          </span>
        </button>
      ) : (
        <button
          onClick={() => handleUpload(page, "speak")}
          disabled={isSpeaking}
          className={`tracking-wider text-[11px] font-sans before:bg-opacity-60 min-w-[125px] sm:min-w-[189px] transition-colors flex gap-2 justify-start items-center mx-auto shadow-xl sm:text-lg backdrop-blur-md lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-2 py-1 sm:px-3 sm:py-2 ease-in-out overflow-hidden border-2 rounded-full group ${isDark
              ? "text-white bg-[#1a063e] border-gray-50/50 before:bg-[#FFFFFF] hover:text-black"
              : "text-gray-800 bg-purple-300 border-purple-300 before:bg-purple-100 "
            }`}
          type="submit"
        >
          <AudioLines
            className={`tracking-wider w-8 h-8 sm:w-12 sm:h-12 group-hover:border-2 transition-all ease-in-out duration-300 rounded-full border p-2 sm:p-3 transform group-hover:rotate-[360deg] ${isDark
                ? "group-hover:border-violet-500 bg-gray-50 text-purple-800 border-gray-700"
                : "group-hover:border-purple-500 bg-purple-50 text-purple-800 border-purple-400"
              }`}
          />
          Read Aloud
        </button>
      );
    }

    if (isSpeaking) {
      return (
        <button
          onClick={handleStop}
          className={`group flex items-center justify-start min-w-[36px] sm:min-w-[48px] rounded-full cursor-pointer relative overflow-hidden transition-all duration-300 shadow-[0px_0px_6px_rgba(0,0,0,1)] hover:shadow-lg disabled:cursor-not-allowed backdrop-blur-md lg:font-semibold ${layout == "vertical"
              ? "h-auto p-2"
              : "h-12 sm:h-20 py-2 px-2"
            } ${isDark
              ? "text-gray-100 shadow-red-500 bg-red-700 border-gray-50"
              : "text-gray-800 shadow-red-400 bg-red-100 border-red-300"
            }`}
        >
          <Square
            className={`tracking-wider ${layout == "vertical"
                ? "w-12 h-12"
                : "w-12 sm:w-16 h-12 sm:h-16"
              } group-hover:border-4 transition-all ease-in-out duration-300 rounded-full border p-2 sm:p-3 transform group-hover:rotate-[360deg] ${isDark
                ? "fill-red-500 border-red-500 group-hover:border-red-700 bg-gray-50 text-gray-50"
                : "fill-red-600 border-red-400 group-hover:border-red-600 bg-red-50 text-red-50"
              }`}
          />
        </button>
      );
    }

    return (
      <div className="tracking-wider flex flex-row justify-center items-center md:gap-2">
        {/* Container for Settings button and popover */}
        <div className="relative z-40">
          <button
            onClick={toggleControls}
            className={`tracking-wider my-auto p-1 sm:p-2 rounded-full shadow-md transition-all duration-300 self-end mr-2 ${isDark
                ? "bg-[#1a063e] hover:shadow-violet-500"
                : "bg-purple-100 hover:shadow-purple-400"
              }`}
            aria-label="Speech settings"
          >
            <Settings className={`tracking-wider h-4 w-4 sm:h-6 sm:w-6 ${isDark ? "text-white" : "text-purple-700"
              }`} />
          </button>
          {/* Speech controls popover */}
          {showControls && (
            <div className={`tracking-wider h-fit z-50 absolute right-10 md:right-10 -top-16 md:bottom-full mb-2 backdrop-blur-md rounded-lg p-3 sm:p-4 shadow-lg border w-32 sm:w-64 ${isDark
                ? "bg-[#1a063e] bg-opacity-90 border-violet-500"
                : "bg-purple-50 bg-opacity-90 border-purple-300"
              }`}>
              <div className="tracking-wider mb-3">
                <label className={`tracking-wider text-xs sm:text-sm block mb-1 ${isDark ? "text-white" : "text-gray-700"
                  }`}>
                  Voice
                </label>
                <select
                  className={`tracking-wider w-full rounded p-1 sm:p-2 border focus:outline-none text-xs ${isDark
                      ? "bg-[#2f0a6e] text-white border-violet-400 focus:border-violet-300"
                      : "bg-white text-gray-700 border-purple-300 focus:border-purple-500"
                    }`}
                  value={selectedVoice?.name ?? ""}
                  onChange={(e) => {
                    const voice = voices.find((v) => v.name === e.target.value);
                    setSelectedVoice(voice);
                  }}
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`tracking-wider text-xs sm:text-sm block mb-1 ${isDark ? "text-white" : "text-gray-700"
                  }`}>
                  Speed: {rate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className={`tracking-wider w-full ${isDark ? "accent-violet-500" : "accent-purple-500"
                    }`}
                />
              </div>
              <button
                onClick={toggleControls}
                className={`tracking-wider mt-1 md:mt-3 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${isDark
                    ? "bg-violet-600 hover:bg-violet-700"
                    : "bg-purple-600 hover:bg-purple-700"
                  }`}
              >
                Close
              </button>
            </div>
          )}
        </div>
        {layout !== "vertical" ? (
          <button
            onClick={handleSpeak}
            disabled={isSpeaking}
            className={`group py-2 px-1.5 before:bg-opacity-60 flex items-center justify-start min-w-[36px] sm:min-w-[48px] h-12 sm:h-20 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300 hover:brightness-100 shadow-[0_0_7px_rgba(0,0,0,1)] hover:min-w-[140px] sm:hover:min-w-[189px] hover:shadow-lg disabled:cursor-not-allowed brightness-150 backdrop-blur-md lg:font-semibold before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 z-10 ease-in-out ${isDark
                ? "text-gray-100 bg-purple-900 bg-opacity-50 shadow-purple-500 border-gray-50 before:bg-[#FFFFFF] hover:text-black"
                : "text-gray-800 bg-violet-600 bg-opacity-60 shadow-purple-400 border-purple-300 before:bg-purple-100 hover:text-black"
              }`}
          >
            <AudioLines
              className={`tracking-wider w-10 h-10 sm:w-16 sm:h-16 group-hover:border-2 transition-all ease-in-out duration-300 rounded-full border p-2 sm:p-3 transform group-hover:rotate-[360deg] ${isDark
                  ? "group-hover:border-violet-500 bg-gray-50 text-purple-800 border-gray-700"
                  : "group-hover:border-purple-500 bg-gray-100 text-violet-600 border-purple-400"
                }`}
            />
            <span
              className={`absolute font-sans ml-2 sm:ml-3 font-bold left-12 sm:left-20 text-[11px] sm:text-lg tracking-tight opacity-0 transform translate-x-2 sm:translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ${isDark
                  ? "text-gray-100 group-hover:text-black"
                  : "text-gray-800 group-hover:text-black"
                }`}
            >
              Speak
            </span>
          </button>
        ) : (
          <button
            onClick={handleSpeak}
            disabled={isSpeaking}
            className={`tracking-wider font-sans before:bg-opacity-60 min-w-fit sm:min-w-[189px] flex gap-3 justify-start items-center mx-auto text-[12px] sm:text-lg shadow-[0px_0px_16px_rgba(0,0,0,1)] bg-opacity-60 backdrop-blur-md lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-300 relative z-10 px-2 pr-5 sm:px-3 sm:pr-3 py-1 sm:py-2 ease-in-out overflow-hidden border-2 rounded-full group group-hover:border-2 duration-300 transition-transform transform group-hover:rotate-[360deg] ${isDark
                ? "text-white bg-[#1a063e] shadow-violet-500 border-violet-300 before:bg-[#FFFFFF] hover:text-black group-hover:border-violet-300"
                : "text-gray-800 bg-gray-200 bg-opacity-50 shadow-purple-400 border-purple-300 before:bg-purple-400 hover:text-black"
              }`}
            type="submit"
          >
            <AudioLines
              className={`tracking-wider w-8 h-8 sm:w-12 sm:h-12 group-hover:border-2 transition-all backdrop-blur-lg ease-in-out duration-300 rounded-full border p-2 sm:p-3 transform group-hover:rotate-[360deg] ${isDark
                  ? "group-hover:border-violet-500 bg-gray-50 text-violet-900 border-gray-700"
                  : "group-hover:border-purple-500 bg-violet-200 text-violet-800 border-purple-400"
                }`}
            />
            Speak
          </button>
        )}
      </div>
    );
  };

  return <div className="tracking-wider flex items-center gap-1 sm:gap-2">{renderButton()}</div>;
};

TextToSpeech.displayName = "TextToSpeech";

export default TextToSpeech;