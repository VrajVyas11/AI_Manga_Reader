"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Save, RefreshCw, Eye, EyeOff, Settings, Languages, Shield, BookOpen } from "lucide-react";
import { usePreferences } from "@/app/providers/PreferencesContext";
import { langFullNames } from "@/app/constants/Flags";

export default function PreferencesModal({ isOpen, onClose }) {
  const { preferences, updatePreferences, resetPreferences } = usePreferences();
  const [draft, setDraft] = useState(preferences);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) setDraft(preferences);
  }, [isOpen, preferences]);

  useEffect(() => {
    function onOutside(e) {
      if (!isOpen) return;
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const types = [
    { key: "manga", label: "Manga" },
    { key: "manhwa", label: "Manhwa" },
    { key: "manhua", label: "Manhua" },
  ];

  const ageRatingKeys = ["all-ages", "teen", "18+", "18++"];

  const toggleArrayItem = (arr = [], key) => {
    const set = new Set(arr || []);
    if (set.has(key)) set.delete(key);
    else set.add(key);
    return Array.from(set);
  };

  const handleTypeToggle = (key) =>
    setDraft({ ...draft, types: toggleArrayItem(draft.types, key) });

  const handleLanguageToggle = (key) =>
    setDraft({ ...draft, languages: toggleArrayItem(draft.languages, key) });

  const handleAgeToggle = (key) =>
    setDraft({
      ...draft,
      contentFilters: {
        ...draft.contentFilters,
        ageRatings: {
          ...draft.contentFilters.ageRatings,
          [key]: !draft.contentFilters.ageRatings?.[key],
        },
      },
    });

  const handleHideAdultToggle = () =>
    setDraft({
      ...draft,
      contentFilters: { ...draft.contentFilters, hideAdult: !draft.contentFilters.hideAdult },
    });

  const handleBlurAdultToggle = () =>
    setDraft({
      ...draft,
      contentFilters: { ...draft.contentFilters, blurAdult: !draft.contentFilters.blurAdult },
    });

  const handleSave = () => {
    if (!draft.languages || draft.languages.length === 0) {
      alert("Select at least one preferred language.");
      return;
    }
    
    if (!draft.types || draft.types.length === 0) {
      setDraft((cur) => {
        const all = types.map((t) => t.key);
        const newDraft = { ...cur, types: all };
        updatePreferences(newDraft);
        onClose();
        return newDraft;
      });
      return;
    }

    updatePreferences(draft);
    onClose();
  };

  const handleReset = () => {
    resetPreferences();
    onClose();
  };

  return (
    <>
      <style jsx global>{`
        .glass-modal {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .dark .glass-modal {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .dark .glass-card {
          background: rgba(51, 65, 85, 0.20);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, #a855f7, #8b5cf6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: linear-gradient(to bottom, #9333ea, #7c3aed);
        }
        .slide-in {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .purple-glow:hover { box-shadow: 0 0 25px rgba(168, 85, 247, 0.4); }
        .yellow-accent { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
      `}</style>

      <div className="fixed inset-0 h-screen z-50 bg-black/90 backdrop-blur-sm">
        <div
          ref={modalRef}
          className="absolute top-1/2 left-1/2 transform backdrop-blur-3xl -translate-x-1/2 -translate-y-1/2 w-[520px] h-[500px] glass-modal rounded-[24px] shadow-2xl slide-in flex flex-col"
        >
          {/* Compact Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Settings className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Preferences</h3>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-5">
            
            {/* Content Types - Compact */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-white">Content Types</span>
                <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full">Required</span>
              </div>
              <div className="flex gap-2">
                {types.map((type) => {
                  const checked = draft.types?.includes(type.key);
                  return (
                    <button
                      key={type.key}
                      onClick={() => handleTypeToggle(type.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        checked 
                          ? "bg-purple-500/30 text-purple-300 ring-1 ring-purple-400/50 purple-glow"
                          : "glass-card text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Languages - Prominent */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-white">Languages</span>
                <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full">Pick 1+</span>
              </div>
              <div className="glass-card rounded-xl p-4 max-h-40 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(langFullNames).map(([code, name]) => {
                    const checked = draft.languages?.includes(code);
                    return (
                      <label
                        key={code}
                        onClick={()=>handleLanguageToggle(code)}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-xs transition-all ${
                          checked 
                            ? "bg-purple-500/30 text-purple-300"
                            : "hover:bg-white/10 text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        <div className={`w-3 h-3 rounded border transition-all ${
                          checked ? "bg-purple-500 border-purple-400" : "border-gray-500"
                        }`}>
                          {checked && <div className="w-1 h-1 bg-white rounded-full m-0.5"></div>}
                        </div>
                        <span className="truncate">{name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Age Ratings - Clean Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-white">Age Ratings</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {ageRatingKeys.map((rating) => {
                  const checked = !!draft.contentFilters?.ageRatings?.[rating];
                  return (
                    <button
                      key={rating}
                      onClick={() => handleAgeToggle(rating)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        checked 
                          ? "bg-purple-500/30 text-purple-300 ring-1 ring-purple-400/50"
                          : "glass-card text-gray-400 hover:bg-white/10 hover:text-gray-300"
                      }`}
                    >
                      {rating}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Adult Content - Professional Toggles */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span className="text-sm font-semibold text-white">Adult Content</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <EyeOff className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Hide adult content</div>
                      <div className="text-xs text-gray-400">Remove explicit works entirely</div>
                    </div>
                  </div>
                  <button
                    onClick={handleHideAdultToggle}
                    className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                      draft.contentFilters?.hideAdult ? "bg-red-500" : "bg-gray-600"
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      draft.contentFilters?.hideAdult ? "translate-x-5" : "translate-x-0.5"
                    }`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Blur adult thumbnails</div>
                      <div className="text-xs text-gray-400">Keep content but blur covers</div>
                    </div>
                  </div>
                  <button
                    onClick={handleBlurAdultToggle}
                    className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                      draft.contentFilters?.blurAdult ? "bg-orange-500" : "bg-gray-600"
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      draft.contentFilters?.blurAdult ? "translate-x-5" : "translate-x-0.5"
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Compact Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white glass-card rounded-lg hover:bg-white/10 transition-all"
            >
              <RefreshCw size={14} />
              Reset
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-all purple-glow"
            >
              <Save size={14} />
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}