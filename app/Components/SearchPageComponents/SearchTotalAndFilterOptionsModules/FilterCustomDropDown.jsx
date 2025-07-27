import React, { useState } from 'react';
import { langFullNames } from "../../../constants/Flags"
import { ChevronDown } from "lucide-react"
// Enhanced FilterCustomDropDown Component
function FilterCustomDropDown({
  title,
  options = [],
  multiple = true,
  selectedValues = [],
  onSelectionChange,
  countLabel,
  isDark=true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCount = multiple ? selectedValues.length : (selectedValues ? 1 : 0);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (value) => {
    onSelectionChange(selectedValues === value ? "" : value);
  };

  const getDisplayText = () => {
    if (selectedCount === 0) return countLabel;

    if (multiple) {
      return selectedValues.map((val, index) => (
        <span key={index} className="inline-flex line-clamp-1 ">
            {countLabel === "Any Language" ? langFullNames[val] : val.charAt(0).toUpperCase() + val.slice(1)}
          </span>
      ));
    }

    return (
      <span  className="inline-flex line-clamp-1 ">
        {selectedValues}
      </span>
    );
  };

return (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark 
        ? 'bg-gradient-to-r from-purple-400 to-violet-400' 
        : 'bg-gradient-to-r from-purple-500 to-violet-500'}`}></div>
      <h3 className={`text-sm font-semibold tracking-wide ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{title}</h3>
    </div>

    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`w-full group relative overflow-hidden backdrop-blur-sm border rounded-xl p-3 transition-all duration-0 ${isOpen
          ? isDark 
            ? 'border-purple-500/60  bg-gray-900/70' 
            : 'border-purple-500/60 bg-white/90'
          : isDark 
            ? 'bg-gray-950/50 border-gray-700/60 hover:border-gray-600/80 hover:bg-gray-900/70' 
            : 'bg-white/80 border-gray-300/60 hover:border-gray-400/80 hover:bg-white/90'
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 text-left">
            <div className={`text-sm flex flex-wrap items-center gap-4 min-h-[20px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {getDisplayText()}
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ml-2 flex-shrink-0 ${isOpen ? 'rotate-180' : ''} ${isDark 
            ? 'text-gray-400 group-hover:text-gray-300' 
            : 'text-gray-500 group-hover:text-gray-700'}`} />
        </div>
      </button>

      {isOpen && (
        <div
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: isDark 
              ? "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)"
              : "rgba(155, 89, 182, 0.8) rgba(255, 255, 255, 0.1)",
          }}
          className={`absolute z-50 w-full mt-2 backdrop-blur-xl border rounded-xl overflow-hidden shadow-2xl ${isDark 
            ? 'bg-black border-gray-700/60 shadow-black/50' 
            : 'bg-white border-gray-300/60 shadow-gray-500/50'}`}>
          <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark 
            ? 'bg-gray-800/50 border-gray-700/50' 
            : 'bg-gray-50/80 border-gray-200/50'}`}>
            <span className={`text-xs font-medium ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
              {selectedCount} Selected
            </span>
          </div>

          <div className={`max-h-48 overflow-y-auto ${isDark 
            ? 'scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-purple-600/50' 
            : 'scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-purple-600/50'}`}>
            <div className="p-2 space-y-1">
              {options.map((option) => (
                <label
                  key={option.label}
                  className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-0 group ${isDark 
                    ? 'hover:bg-gray-800/60' 
                    : 'hover:bg-gray-100/60'}`}
                >
                  <div className="relative">
                    <input
                      type={multiple ? "checkbox" : "radio"}
                      checked={multiple
                        ? selectedValues.includes(option.id)
                        : selectedValues === option.id
                      }
                      onChange={() => handleCheckboxChange(option.id)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border-2 transition-all duration-0 ${(multiple ? selectedValues.includes(option.id) : selectedValues === option.id)
                      ? isDark 
                        ? 'bg-purple-500/40 border-purple-500/20' 
                        : 'bg-purple-500/90 border-purple-500/20'
                      : isDark 
                        ? 'border-gray-500' 
                        : 'border-gray-400'
                      }`}>
                      {(multiple ? selectedValues.includes(option.id) : selectedValues === option.id) && (
                        <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <span className={`text-sm font-medium flex-1 transition-colors ${isDark 
                    ? 'text-gray-200 group-hover:text-white' 
                    : 'text-gray-700 group-hover:text-gray-900'}`}>
                    {option.label}
                  </span>

                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}


export default FilterCustomDropDown;