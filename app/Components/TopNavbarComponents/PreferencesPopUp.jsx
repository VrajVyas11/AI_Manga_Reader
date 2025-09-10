'use client';
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  X,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Languages,
  Shield,
  CheckCircle2,
  Circle,
  Settings,
  Clapperboard,
} from "lucide-react";
import { langFullNames } from "@/app/constants/Flags";
import StableFlag from "../StableFlag";
import { usePreferences } from "@/app/providers/PreferencesContext";

export default function PreferencesModal({ isOpen = true, onClose = () => { }, isDark = true }) {
  const { preferences, updatePreferences, resetPreferences } = usePreferences();
  const [draft, setDraft] = useState(preferences);
  const modalRef = useRef(null);

  // Memoize static data to prevent re-renders
  const types = useMemo(() => [
    { key: "manga", label: "Manga", icon: "ja", desc: "Japanese comics" },
    { key: "manhwa", label: "Manhwa", icon: "ko", desc: "Korean comics" },
    { key: "manhua", label: "Manhua", icon: "zh", desc: "Chinese comics" },
  ], []);

  const ageRatings = useMemo(() => [
    { key: "all-ages", label: "All Ages", desc: "Family friendly", color: "text-emerald-400" },
    { key: "teen", label: "Teen", desc: "13+ content", color: "text-blue-400" },
    { key: "18+", label: "18+", desc: "Adult content", color: "text-amber-400" },
    { key: "18++", label: "18++", desc: "Explicit content", color: "text-red-400" },
  ], []);

  // Sync draft with preferences when modal opens
  useEffect(() => {
    if (isOpen) setDraft(preferences);
  }, [isOpen, preferences]);

  // Handle click outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (!isOpen) return;
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen, onClose]);

  // Optimized toggle functions with useCallback
  const toggleArrayItem = useCallback((arr, key) => {
    const set = new Set(arr || []);
    if (set.has(key)) set.delete(key);
    else set.add(key);
    return Array.from(set);
  }, []);

  const handleTypeToggle = useCallback((key) => {
    setDraft(prev => ({ ...prev, types: toggleArrayItem(prev.types, key) }));
  }, [toggleArrayItem]);

  const handleLanguageToggle = useCallback((key) => {
    setDraft(prev => ({ ...prev, languages: toggleArrayItem(prev.languages, key) }));
  }, [toggleArrayItem]);

  const handleAgeToggle = useCallback((key) => {
    setDraft(prev => ({
      ...prev,
      contentFilters: {
        ...prev.contentFilters,
        ageRatings: {
          ...prev.contentFilters.ageRatings,
          [key]: !prev.contentFilters.ageRatings?.[key],
        },
      },
    }));
  }, []);

  const handleAdultSettingToggle = useCallback((setting) => {
    setDraft(prev => ({
      ...prev,
      contentFilters: {
        ...prev.contentFilters,
        [setting]: !prev.contentFilters[setting]
      },
    }));
  }, []);

  const handleSave = useCallback(() => {
    if (!draft.languages || draft.languages.length === 0) {
      alert("Please select at least one language.");
      return;
    }
    if (!draft.types || draft.types.length === 0) {
      const allTypes = types.map(t => t.key);
      const newDraft = { ...draft, types: allTypes };
      updatePreferences(newDraft);
      onClose();
      return;
    }
    updatePreferences(draft);
    onClose();
  }, [draft, types, updatePreferences, onClose]);

  const handleReset = useCallback(() => {
    resetPreferences();
    onClose();
  }, [resetPreferences, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 h-screen flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div className={`absolute inset-0 ${isDark ? "bg-black/80 backdrop-blur-sm" : "bg-black/20 backdrop-blur-sm"}`} />
      {/* Modal */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-[95vw] sm:max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border backdrop-blur-lg ${isDark ? "bg-black/40 border-neutral-800 text-white" : "bg-white border-gray-200 text-gray-900"}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${isDark ? "bg-neutral-950/95 border-neutral-800" : "bg-white/95 border-gray-200"} backdrop-blur-sm`}>
          <div className="flex flex-row items-center gap-2 sm:gap-4">
            <span className={`${isDark ? 'p-2 sm:p-3.5 bg-purple-600/20' : 'p-2 bg-purple-100'} rounded-full`}>
              <Settings className="w-6 h-6 sm:w-7 sm:h-7"/>
            </span>
            <div>
              <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Reading Preferences</h2>
              <p className={`text-xs sm:text-sm ${isDark ? "text-neutral-400" : "text-gray-600"} mt-1`}>Customize your reading experience</p>
            </div>
          </div>
          <div className="flex  items-center gap-2 sm:gap-3">
            <button
              onClick={handleReset}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${isDark ? "text-neutral-300 hover:text-white hover:bg-neutral-800" : "text-gray-700 hover:text-white hover:bg-gray-300"}`}
            >
              <RotateCcw size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:block">Reset</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-1 sm:py-2 bg-purple-800 hover:bg-purple-700 text-white font-semibold rounded-full transition-all duration-200 shadow-lg text-xs sm:text-sm"
            >
              <Save size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:block">Apply</span>
            </button>
            <button
              onClick={onClose}
              className={`p-1 sm:p-2 rounded-full transition-all duration-200 ${isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              <X size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Content Types */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`${isDark ? 'p-2 sm:p-3 bg-purple-600/20 rounded-full' : 'p-2 bg-purple-100 rounded-full'}`}>
                  <Clapperboard className={`${isDark ? 'w-4 h-4 sm:w-5 sm:h-5 text-purple-400' : 'w-4 h-4 sm:w-5 sm:h-5 text-purple-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Content Types</h3>
                  <p className={`text-xs ${isDark ? "text-neutral-400" : "text-gray-600"}`}>Choose what to show</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-3">
                {types.map((type) => {
                  const isSelected = draft.types?.includes(type.key);
                  return (
                    <button
                      key={type.key}
                      onClick={() => handleTypeToggle(type.key)}
                      className={`p-3 sm:p-4 rounded-xl border transition-all duration-200 text-left group ${isSelected ? isDark ? "bg-purple-600/20 border-purple-600 shadow-lg" : "bg-purple-100 border-purple-300 text-purple-800 shadow-sm" : `${isDark ? "bg-neutral-700/50" : "bg-gray-100"} border ${isDark ? 'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <StableFlag code={type.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                        {isSelected ?
                          <CheckCircle2 className={`${isDark ? 'w-4 h-4 sm:w-5 sm:h-5 text-purple-400' : 'w-4 h-4 sm:w-5 sm:h-5 text-purple-600'}`} /> :
                          <Circle className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-neutral-600 group-hover:text-neutral-500' : 'text-gray-300 group-hover:text-gray-500'}`} />
                        }
                      </div>
                      <div className={`font-medium text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>{type.label}</div>
                      <div className={`text-xs ${isDark ? "text-neutral-400" : "text-gray-600"}`}>{type.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Age Ratings */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`${isDark ? 'p-2 sm:p-3 bg-yellow-600/20 rounded-full' : 'p-2 bg-yellow-100 rounded-full'}`}>
                  <Shield className={`${isDark ? 'w-4 h-4 sm:w-5 sm:h-5 text-yellow-400' : 'w-4 h-4 sm:w-5 sm:h-5 text-yellow-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Age Ratings</h3>
                  <p className={`text-xs ${isDark ? "text-neutral-400" : "text-gray-600"}`}>Filter by content rating</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {ageRatings.map((rating) => {
                  const isSelected = !!draft.contentFilters?.ageRatings?.[rating.key];
                  return (
                    <button
                      key={rating.key}
                      onClick={() => handleAgeToggle(rating.key)}
                      className={`p-3 sm:p-4 rounded-xl border transition-all duration-200 text-left ${isSelected ? (isDark ? 'bg-neutral-800 border-neutral-600' : 'bg-gray-100 border-gray-300') : (isDark ? 'bg-neutral-800/30 border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50' : 'bg-white/50 border-gray-200 hover:border-gray-300 hover:bg-gray-50')}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`text-xs sm:text-sm font-bold ${rating.color}`}>
                          {rating.label}
                        </div>
                        {isSelected ?
                          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" /> :
                          <Circle className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? 'text-neutral-600' : 'text-gray-300'}`} />
                        }
                      </div>
                      <div className={`text-xs ${isDark ? "text-neutral-400" : "text-gray-600"}`}>{rating.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-3 sm:space-y-4 -mt-6 sm:-mt-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`${isDark ? 'p-2 sm:p-3 bg-blue-600/20 rounded-full' : 'p-2 bg-blue-100 rounded-full'}`}>
                  <Languages className={`${isDark ? 'w-4 h-4 sm:w-5 sm:h-5 text-blue-400' : 'w-4 h-4 sm:w-5 sm:h-5 text-blue-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Languages</h3>
                  <p className={`text-xs ${isDark ? "text-neutral-400" : "text-gray-600"}`}>Select preferred languages</p>
                </div>
              </div>
              <div
                style={{ scrollbarWidth: "thin", scrollbarColor: 'rgba(155, 0, 200, 0.6) rgba(0, 0, 0, 0.1)' }}
                className={`${isDark ? 'max-h-40 sm:max-h-48 overflow-y-auto bg-neutral-800/30' : 'max-h-40 sm:max-h-48 overflow-y-auto bg-gray-50'} rounded-xl p-2 sm:p-3`}
              >
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries({ ...{ all: "All languages" }, ...langFullNames }).map(([code, name]) => {
                    const isSelected = draft.languages?.includes(code);
                    return (
                      <button
                        key={code}
                        onClick={() => handleLanguageToggle(code)}
                        className={`px-4 sm:px-6 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 text-left ${isSelected ? (isDark ? 'bg-purple-600/20 border border-purple-500 text-white shadow-md' : 'bg-purple-100 border border-purple-300 text-purple-800 shadow-sm') : (isDark ? 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700 hover:text-white' : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900')}`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Adult Content Settings */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`${isDark ? 'p-2 sm:p-3 bg-red-600/20 rounded-full' : 'p-2 bg-red-100 rounded-full'}`}>
                  <Eye className={`${isDark ? 'w-4 h-4 sm:w-5 sm:h-5 text-red-400' : 'w-4 h-4 sm:w-5 sm:h-5 text-red-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Adult Content</h3>
                  <p className={`text-xs ${isDark ? "text-neutral-400" : "text-gray-600"}`}>Control mature content display</p>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {[
                  {
                    key: 'hideAdult',
                    label: 'Hide Adult Content',
                    desc: 'Completely hide explicit content',
                    icon: EyeOff,
                  },
                  {
                    key: 'blurAdult',
                    label: 'Blur Adult Covers',
                    desc: 'Apply blur effect to adult thumbnails',
                    icon: Eye,
                  }
                ].map((setting) => {
                  const Icon = setting.icon;
                  const isEnabled = draft.contentFilters?.[setting.key];
                  return (
                    <div
                      key={setting.key}
                      className={`${isDark ? 'flex items-center justify-between p-3 sm:p-4 bg-neutral-800/30 rounded-xl border border-neutral-700' : 'flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl border border-gray-200'}`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`${isDark ? 'p-1 sm:p-2 bg-neutral-700 rounded-full' : 'p-1 sm:p-2 bg-gray-100 rounded-full'}`}>
                          <Icon className={`${isDark ? 'w-3 h-3 sm:w-4 sm:h-4 text-neutral-300' : 'w-3 h-3 sm:w-4 sm:h-4 text-gray-600'}`} />
                        </div>
                        <div>
                          <div className={`font-medium text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>{setting.label}</div>
                          <div className={`text-xs ${isDark ? "text-neutral-400" : "text-gray-600"}`}>{setting.desc}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAdultSettingToggle(setting.key)}
                        className={`relative w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-all duration-200 ${isEnabled ? isDark ? "bg-purple-600" : "bg-purple-600" : isDark ? "bg-neutral-600" : "bg-gray-200"}`}
                      >
                        <div
                          className={`absolute top-0.5 sm:top-1 w-3 sm:w-4 h-3 sm:h-4 bg-white rounded-full transition-all duration-200 ${isEnabled ? 'left-6 sm:left-7' : 'left-1'}`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}