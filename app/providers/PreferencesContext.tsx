/* eslint-disable no-unused-vars */
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AgeRatings {
  'all-ages': boolean;
  'teen': boolean;
  '18+': boolean;
  '18++': boolean;
}

interface ContentFilters {
  hideAdult: boolean;
  blurAdult: boolean;
  showRatings: boolean;
  ageRatings: AgeRatings;
}

interface ReadingPreferences {
  autoplay: boolean;
  soundEffects: boolean;
  notifications: boolean;
  autoBookmark: boolean;
}

interface DisplayPreferences {
  showCoverArt: boolean;
  compactView: boolean;
  showProgress: boolean;
}

interface UserPreferences {
  languages: Array<string>;
  contentFilters: ContentFilters;
  reading: ReadingPreferences;
  display: DisplayPreferences;
}

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  languages: ['all'],
  contentFilters: {
    hideAdult: false,
    blurAdult: true,
    showRatings: true,
    ageRatings: {
      'all-ages': true,
      'teen': true,
      '18+': true,
      '18++': true
    }
  },
  reading: {
    autoplay: false,
    soundEffects: true,
    notifications: true,
    autoBookmark: true
  },
  display: {
    showCoverArt: true,
    compactView: false,
    showProgress: true
  }
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      try {
        const parsedPreferences = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsedPreferences });
      } catch (error) {
        console.error('Error parsing preferences:', error);
      }
    }
  }, []);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('userPreferences', JSON.stringify(updated));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, resetPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};