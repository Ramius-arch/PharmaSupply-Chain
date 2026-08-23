import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSliders, 
  faSun, 
  faEye, 
  faLayerGroup, 
  faShieldHalved, 
  faMicrochip, 
  faHeartPulse, 
  faArrowRight,
  faExpand
} from '@fortawesome/free-solid-svg-icons';
import backdropImage from '../assets/warm-nostalgic-backdrop.jpg';
import './ImmersiveBackdropTest.css';

const ImmersiveBackdropTest = () => {
  const [opacity, setOpacity] = useState(0.85);
  const [blurAmount, setBlurAmount] = useState(0);
  const [blendMode, setBlendMode] = useState('normal');
  const [showGrain, setShowGrain] = useState(true);
  const [vignetteIntensity, setVignetteIntensity] = useState(0.45);
  const [showCards, setShowCards] = useState(true);
  const [fullBleed, setFullBleed] = useState(false);

  return (
    <div className={`immersive-test-stage ${fullBleed ? 'full-bleed-mode' : ''}`}>
      {/* ── Immersive Background Image Layer ── */}
      <div 
        className="immersive-image-layer"
        style={{
          backgroundImage: `url(${backdropImage})`,
          opacity: opacity,
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
          mixBlendMode: blendMode,
        }}
      />

      {/* ── Film Grain Overlay ── */}
      {showGrain && <div className="immersive-grain-overlay" />}

      {/* ── Vignette Depth Overlay ── */}
      <div 
        className="immersive-vignette-overlay" 
        style={{
          background: `radial-gradient(circle at 50% 40%, transparent 20%, rgba(9, 13, 20, ${vignetteIntensity}) 90%)`
        }}
      />

      {/* ── Content Container ── */}
      <div className="immersive-content-container">
        
        {/* Header Ribbon */}
        <div className="immersive-test-header">
          <div className="test-badge">
            <FontAwesomeIcon icon={faSun} className="badge-icon-warm" />
            <span>Isolated Sensory Testbed</span>
          </div>
          <h1 className="immersive-title">Warm Nostalgic Atmosphere</h1>
          <p className="immersive-subtitle">
            Evaluating optical depth, emotional lighting diffusion, and glassmorphic contrast with cyber-organic interface elements.
          </p>
        </div>

        {/* ── Interactive Controls Floating Console ── */}
        <div className="test-control-console glass-panel">
          <div className="console-heading">
            <FontAwesomeIcon icon={faSliders} />
            <h3>Lighting & Depth Calibration</h3>
          </div>

          <div className="controls-grid">
            {/* Opacity */}
            <div className="control-field">
              <div className="field-meta">
                <label>Layer Opacity</label>
                <span className="field-val">{Math.round(opacity * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.05" 
                value={opacity} 
                onChange={(e) => setOpacity(parseFloat(e.target.value))} 
                className="slider-input"
              />
            </div>

            {/* Additional Blur */}
            <div className="control-field">
              <div className="field-meta">
                <label>Gaussian Softness</label>
                <span className="field-val">{blurAmount}px</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="24" 
                step="2" 
                value={blurAmount} 
                onChange={(e) => setBlurAmount(parseInt(e.target.value, 10))} 
                className="slider-input"
              />
            </div>

            {/* Vignette Depth */}
            <div className="control-field">
              <div className="field-meta">
                <label>Vignette Shadow</label>
                <span className="field-val">{Math.round(vignetteIntensity * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="0.95" 
                step="0.05" 
                value={vignetteIntensity} 
                onChange={(e) => setVignetteIntensity(parseFloat(e.target.value))} 
                className="slider-input"
              />
            </div>

            {/* Blend Mode */}
            <div className="control-field">
              <div className="field-meta">
                <label>Optical Blend Mode</label>
              </div>
              <div className="blend-pill-group">
                {['normal', 'soft-light', 'screen', 'overlay'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setBlendMode(mode)}
                    className={`blend-btn ${blendMode === mode ? 'active' : ''}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="toggles-row">
            <button 
              type="button" 
              className={`toggle-chip ${showGrain ? 'active' : ''}`}
              onClick={() => setShowGrain(!showGrain)}
            >
              <FontAwesomeIcon icon={faLayerGroup} /> Film Texture: {showGrain ? 'ON' : 'OFF'}
            </button>
            <button 
              type="button" 
              className={`toggle-chip ${showCards ? 'active' : ''}`}
              onClick={() => setShowCards(!showCards)}
            >
              <FontAwesomeIcon icon={faEye} /> UI Overlay: {showCards ? 'VISIBLE' : 'HIDDEN'}
            </button>
            <button 
              type="button" 
              className={`toggle-chip ${fullBleed ? 'active' : ''}`}
              onClick={() => setFullBleed(!fullBleed)}
            >
              <FontAwesomeIcon icon={faExpand} /> {fullBleed ? 'Exit Full Screen' : 'Full Screen View'}
            </button>
          </div>
        </div>

        {/* ── Sample Glassmorphic Test Cards ── */}
        {showCards && (
          <div className="test-cards-bento">
            <div className="bento-glass-card primary-card">
              <div className="card-top-icon">
                <FontAwesomeIcon icon={faShieldHalved} />
              </div>
              <h3>Pharmaceutical Cold-Chain Provenance</h3>
              <p>
                Every thermal spike and geolocation telemetry packet anchored permanently on decentralized ledgers with zero-latency cryptographic verification.
              </p>
              <div className="card-action-row">
                <button className="sample-cta-btn">
                  Explore Ledger <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>

            <div className="bento-glass-card metric-card">
              <div className="metric-header">
                <FontAwesomeIcon icon={faHeartPulse} className="text-emerald" />
                <span className="live-pulse">LIVE SENSOR</span>
              </div>
              <div className="metric-number">4.2°C</div>
              <div className="metric-desc">Optimal Biologic Preservation Range (2°C - 8°C)</div>
            </div>

            <div className="bento-glass-card telemetry-card">
              <div className="metric-header">
                <FontAwesomeIcon icon={faMicrochip} className="text-cyan" />
                <span>ACTIVE CONSENSUS</span>
              </div>
              <div className="metric-number">99.98%</div>
              <div className="metric-desc">Autonomous Smart Contract Execution Rate</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ImmersiveBackdropTest;
