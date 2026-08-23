import React, { useContext } from 'react';
import { AmbienceContext } from '../../context/AmbienceContext';
import backdropImage from '../../assets/warm-nostalgic-backdrop.jpg';
import './AmbientBackdrop.css';

const AmbientBackdrop = () => {
  const { ambientMode, intensity } = useContext(AmbienceContext);

  return (
    <div className={`global-ambient-backdrop mode-${ambientMode}`} aria-hidden="true">
      {/* ── Warm Nostalgic Texture Layer ── */}
      {ambientMode === 'warm' && (
        <div 
          className="ambient-warm-image-layer"
          style={{ 
            backgroundImage: `url(${backdropImage})`,
            opacity: intensity 
          }}
        />
      )}

      {/* ── Cyber Biologics Texture Layer ── */}
      {ambientMode === 'cyber' && (
        <div 
          className="ambient-cyber-layer"
          style={{ opacity: intensity + 0.1 }}
        />
      )}

      {/* ── Analogue Film Grain Micro-Texture ── */}
      <div className="ambient-film-grain" />

      {/* ── Cinematic Radial Vignette (Preserves WCAG AAA Contrast) ── */}
      <div className="ambient-vignette-mask" />
    </div>
  );
};

export default AmbientBackdrop;
