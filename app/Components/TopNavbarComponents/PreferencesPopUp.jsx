"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  Languages,
  Shield,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { usePreferences } from "@/app/providers/PreferencesContext";
import { langFullNames } from "@/app/constants/Flags";
import StableFlag from "../StableFlag";

/**
 * PreferencesModal (Tailwind-only + small scoped CSS for scrollbar)
 * - Dark theme, flat colors (no gradients)
 * - Purple + yellow accents
 * - Two-column responsive layout (no tabs)
 * - Thin purple scrollbar applied to the main scroll container
 */

export default function PreferencesPopUp({ isOpen, onClose }) {
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
    { key: "manga", label: "Manga", icon: "ja" },
    { key: "manhwa", label: "Manhwa", icon: "ko" },
    { key: "manhua", label: "Manhua", icon: "zh" },
  ];

  const ageRatingKeys = [
    { key: "all-ages", label: "All Ages", color: "emerald" },
    { key: "teen", label: "Teen", color: "sky" },
    { key: "18+", label: "18+", color: "amber" },
    { key: "18++", label: "18++", color: "rose" },
  ];

  const toggleArrayItem = (arr, key) => {
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
    <div
      className="fixed inset-0 z-50 h-screen flex items-center justify-center"
      aria-hidden
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-hidden />

      {/* Small scoped CSS for thin purple scrollbar on .prefs-scroll */}
      <style>{`
        /* Thin purple scrollbar for modern browsers */
        .prefs-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
        .prefs-scroll::-webkit-scrollbar-track { background: transparent; }
        .prefs-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(139,92,246,0.9); /* purple-600 */
          border-radius: 999px;
        }
        .prefs-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(139,92,246,1);
        }

        /* Firefox */
        .prefs-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(139,92,246,0.9) transparent;
        }
      `}</style>

      {/* modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative w-[880px] max-w-[96%] max-h-[90vh] rounded-2xl
                   bg-neutral-900 border border-neutral-800 p-0 flex flex-col shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-neutral-800 border border-neutral-700">
              <Settings className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                Preferences
                <Sparkles className="w-4 h-4 text-purple-400" />
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">Configure what appears while reading</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-neutral-300 hover:bg-neutral-800/40 transition"
              title="Reset to defaults"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>

            <button
              onClick={() => { setDraft(preferences); onClose(); }}
              className="px-3 py-2 rounded-md text-xs font-medium text-neutral-300 hover:bg-neutral-800/40 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-purple-600 text-black font-semibold shadow-sm hover:opacity-95 transition"
            >
              <Save className="w-4 h-4" />
              Save
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-md flex items-center justify-center text-neutral-300 hover:bg-neutral-800/40 transition"
              aria-label="Close preferences"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body: two-column responsive layout */}
        <div className="p-6 prefs-scroll overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column: Types + Age Ratings */}
            <div className="space-y-6">
              {/* Content Types */}
              <section className="p-4 rounded-lg bg-neutral-850 border border-neutral-800">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-purple-300" />
                  <h4 className="text-sm font-semibold text-gray-100">Content Types</h4>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-300 border border-yellow-400/10">required</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {types.map((type) => {
                    const checked = draft.types?.includes(type.key);
                    return (
                      <button
                        key={type.key}
                        onClick={() => handleTypeToggle(type.key)}
                        className={`flex flex-col my-6 gap-2 p-3 rounded-md w-fit text-left transition border
                          ${checked ? "bg-neutral-800 border-purple-600" : "bg-neutral-900/30 border-neutral-800"}
                          hover:shadow-[0_6px_18px_rgba(124,58,237,0.06)]`}
                      >
                        <div className="flex flex-row justify-start items-center gap-2"><StableFlag code={type.icon} className={` h-6 w-6`}/>
                        <div className="font-medium text-gray-100">{type.label}</div>
                        </div>
                        <div className="text-xs text-neutral-400">Traditional style</div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Age Ratings */}
              <section className="p-4 rounded-lg bg-neutral-850 border border-neutral-800">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-purple-300" />
                  <h4 className="text-sm font-semibold text-gray-100">Age Ratings</h4>
                  <p className="text-xs text-neutral-400 ml-auto">toggle visibility</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {ageRatingKeys.map((rating) => {
                    const checked = !!draft.contentFilters?.ageRatings?.[rating.key];

                    return (
                      <button
                        key={rating.key}
                        onClick={() => handleAgeToggle(rating.key)}
                        className={`flex  items-center gap-3 p-4 mt-0.5 rounded-md transition border
                          ${checked ? "bg-neutral-800 border-purple-600 shadow-sm" : "bg-neutral-900/30 border-neutral-800"}
                          hover:translate-y-[-2px]`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center  ${checked ? "bg-purple-500/80" : "bg-neutral-800/60"}`}>
                          {checked ? "✓" : ""}
                        </div>
                        <div className="text-sm font-medium text-gray-100">{rating.label}</div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Right column: Languages + Adult Controls */}
            <div className="space-y-6">
              {/* Languages */}
              <section className="p-4 rounded-lg bg-neutral-850 border border-neutral-800">
                <div className="flex items-center gap-2 mb-3">
                  <Languages className="w-5 h-5 text-purple-300" />
                  <h4 className="text-sm font-semibold text-gray-100">Preferred Languages</h4>
                  <p className="text-xs text-neutral-400 ml-auto">select 1+</p>
                </div>

                <div className="max-h-32 overflow-y-auto grid grid-cols-2 gap-2 p-1">
                  {Object.entries(langFullNames).map(([code, name]) => {
                    const checked = draft.languages?.includes(code);
                    return (
                      <button
                        key={code}
                        onClick={() => handleLanguageToggle(code)}
                        className={`text-sm border border-gray-500/30 px-3 py-2 rounded-md text-left transition
                          ${checked ? "bg-purple-600 text-white shadow-[inset_0_0_16px_rgba(88,47,160,0.12)]" : "bg-neutral-900/30 text-neutral-200"}
                          hover:scale-[1.02]`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Adult Content Controls */}
              <section className="p-4 rounded-lg bg-neutral-850 border border-neutral-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <h4 className="text-sm font-semibold text-gray-100">Adult Content Settings</h4>
                  <p className="text-xs text-neutral-400 ml-auto">visibility & thumbnails</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-neutral-900/20 border border-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-neutral-800 flex items-center justify-center">
                        <EyeOff className="w-4 h-4 text-yellow-300" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-100">Hide Adult Content</div>
                        <div className="text-xs text-neutral-400">Removes explicit items</div>
                      </div>
                    </div>

                    <button
                      onClick={handleHideAdultToggle}
                      className={`relative inline-flex items-center h-6 w-11 rounded-full transition ${draft.contentFilters?.hideAdult ? "bg-yellow-400" : "bg-neutral-700/40"}`}
                      aria-pressed={!!draft.contentFilters?.hideAdult}
                    >
                      <span className={`absolute left-1 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${draft.contentFilters?.hideAdult ? "translate-x-5" : ""}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-neutral-900/20 border border-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-yellow-900/10 flex items-center justify-center">
                        <Eye className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-100">Blur Adult Covers</div>
                        <div className="text-xs text-neutral-400">Soft blur on thumbnails</div>
                      </div>
                    </div>

                    <button
                      onClick={handleBlurAdultToggle}
                      className={`relative inline-flex items-center h-6 w-11 rounded-full transition ${draft.contentFilters?.blurAdult ? "bg-purple-600" : "bg-neutral-700/40"}`}
                      aria-pressed={!!draft.contentFilters?.blurAdult}
                    >
                      <span className={`absolute left-1 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${draft.contentFilters?.blurAdult ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}