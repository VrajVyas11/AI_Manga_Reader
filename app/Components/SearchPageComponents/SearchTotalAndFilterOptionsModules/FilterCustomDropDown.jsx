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
      <span key={index} className="inline-flex line-clamp-1 ">
        {selectedValues}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 animate-pulse"></div>
        <h3 className="text-sm font-semibold text-gray-200 tracking-wide">{title}</h3>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className={`w-full group relative overflow-hidden bg-gray-950/50 backdrop-blur-sm border rounded-xl p-3 transition-all duration-300 hover:bg-gray-900/70 ${isOpen
            ? 'border-purple-500/60  bg-gray-900/70'
            : 'border-gray-700/60 hover:border-gray-600/80'
            }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 text-left">
              <div className="text-sm text-gray-300 flex flex-wrap items-center gap-4 min-h-[20px]">
                {getDisplayText()}
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ml-2 flex-shrink-0 ${isOpen ? 'rotate-180' : 'group-hover:text-gray-300'
              }`} />
          </div>
        </button>

        {isOpen && (
          <div
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)",
            }}
            className="absolute z-50 w-full mt-2 bg-black backdrop-blur-xl border border-gray-700/60 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
              <span className="text-xs text-purple-300 font-medium">
                {selectedCount} Selected
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-purple-600/50">
              <div className="p-2 space-y-1">
                {options.map((option) => (
                  <label
                    key={option.label}
                    className="flex items-center gap-3 p-2.5 hover:bg-gray-800/60 rounded-lg cursor-pointer transition-all duration-200 group"
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
                      <div className={`w-4 h-4 rounded border-2 transition-all duration-200 ${(multiple ? selectedValues.includes(option.id) : selectedValues === option.id)
                        ? 'bg-purple-500/40 border-purple-500/20 '
                        : 'border-gray-500 '
                        }`}>
                        {(multiple ? selectedValues.includes(option.id) : selectedValues === option.id) && (
                          <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <span className="text-sm text-gray-200 font-medium flex-1 group-hover:text-white transition-colors">
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