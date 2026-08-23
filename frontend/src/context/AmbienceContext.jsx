import React, { createContext, useState, useEffect } from 'react';

export const AmbienceContext = createContext();

export const AmbienceProvider = ({ children }) => {
  const [ambientMode, setAmbientMode] = useState(() => {
    return localStorage.getItem('pharma_ambience_mode') || 'warm';
  });

  const [intensity, setIntensity] = useState(() => {
    const saved = localStorage.getItem('pharma_ambience_intensity');
    return saved ? parseFloat(saved) : 0.38;
  });

  useEffect(() => {
    localStorage.setItem('pharma_ambience_mode', ambientMode);
  }, [ambientMode]);

  useEffect(() => {
    localStorage.setItem('pharma_ambience_intensity', intensity.toString());
  }, [intensity]);

  const cycleAmbience = () => {
    setAmbientMode((prev) => {
      if (prev === 'warm') return 'obsidian';
      if (prev === 'obsidian') return 'cyber';
      return 'warm';
    });
  };

  return (
    <AmbienceContext.Provider
      value={{
        ambientMode,
        setAmbientMode,
        cycleAmbience,
        intensity,
        setIntensity,
      }}
    >
      {children}
    </AmbienceContext.Provider>
  );
};
