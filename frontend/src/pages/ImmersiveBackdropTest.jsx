import React, { useState, useEffect, useRef } from 'react';
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
  faExpand,
  faPlay,
  faPause,
  faForward,
  faBackward,
  faVideo,
  faImage,
  faHandHoldingHeart,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

import storyCare from '../assets/story-1-human-care.jpg';
import storyHope from '../assets/story-3-healing-hope.jpg';

import './ImmersiveBackdropTest.css';

const mediaCollection = [
  {
    id: 'photo-care',
    type: 'image',
    tag: 'Picture 01',
    title: 'The Touch of Care',
    subtitle: 'Human compassion at the bedside',
    narrative: 'Behind every batch number is a patient seeking healing, and a reassuring hand in the morning sun.',
    source: storyCare,
    icon: faHandHoldingHeart,
  },
  {
    id: 'photo-hope',
    type: 'image',
    tag: 'Picture 02',
    title: 'Life, Restored',
    subtitle: 'Moments protected by genuine medicine',
    narrative: 'When the pharmaceutical chain remains unbroken, families enjoy serene walks in warm golden light.',
    source: storyHope,
    icon: faUsers,
  },
  {
    id: 'video-ambient',
    type: 'video',
    tag: 'Ambient Video',
    title: 'Golden Flow',
    subtitle: 'Organic warmth & drifting bokeh',
    narrative: 'A gentle, slow-moving kinetic stream of golden light waves and floating dust motes.',
    source: null,
    icon: faVideo,
  },
];

const ImmersiveBackdropTest = () => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Calibrated subtle defaults — supporting role without stealing focus
  const [opacity, setOpacity] = useState(0.38);
  const [blurAmount, setBlurAmount] = useState(10);
  const [blendMode, setBlendMode] = useState('normal');
  const [showGrain, setShowGrain] = useState(true);
  const [kenBurns, setKenBurns] = useState(true);
  const [vignetteIntensity, setVignetteIntensity] = useState(0.68);
  const [showCards, setShowCards] = useState(true);
  const [fullBleed, setFullBleed] = useState(false);

  const videoCanvasRef = useRef(null);
  const activeMedia = mediaCollection[activeMediaIndex];

  // Slow, unhurried 12-second cycle between the 2 pictures and 1 ambient video
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveMediaIndex((prev) => (prev + 1) % mediaCollection.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Procedural 60fps Ambient Cinematic Video Engine
  useEffect(() => {
    const canvas = videoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Warm bokeh bubbles
    const orbs = Array.from({ length: 9 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 200 + 160,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.35,
      hue: i % 2 === 0 ? 'rgba(255, 145, 40,' : 'rgba(245, 190, 80,',
      baseAlpha: Math.random() * 0.25 + 0.15,
    }));

    // Floating sun motes
    const motes = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.3 - 0.1,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const time = Date.now() * 0.0003;

      // Draw drifting warm bokeh orbs
      orbs.forEach((orb, i) => {
        orb.x += orb.vx + Math.sin(time + i) * 0.2;
        orb.y += orb.vy + Math.cos(time * 0.8 + i) * 0.2;

        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, `${orb.hue} ${orb.baseAlpha})`);
        grad.addColorStop(0.6, `${orb.hue} ${orb.baseAlpha * 0.4})`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw gentle drifting sun motes
      motes.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -5) {
          m.y = height + 5;
          m.x = Math.random() * width;
        }
        if (m.x < -5) m.x = width + 5;
        if (m.x > width + 5) m.x = -5;

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 220, 150, ${m.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleNext = () => {
    setActiveMediaIndex((prev) => (prev + 1) % mediaCollection.length);
  };

  const handlePrev = () => {
    setActiveMediaIndex((prev) => (prev - 1 + mediaCollection.length) % mediaCollection.length);
  };

  return (
    <div className={`immersive-test-stage ${fullBleed ? 'full-bleed-mode' : ''}`}>
      
      {/* ── Background Layer: Picture 01 or Picture 02 ── */}
      {activeMedia.type === 'image' && (
        <div 
          className={`immersive-image-layer ${kenBurns ? 'ken-burns-active' : ''}`}
          style={{
            backgroundImage: `url(${activeMedia.source})`,
            opacity: opacity,
            filter: `blur(${blurAmount}px)`,
            mixBlendMode: blendMode,
          }}
        />
      )}

      {/* ── Background Layer: Ambient Video Loop ── */}
      <canvas 
        ref={videoCanvasRef} 
        className="ambient-video-canvas"
        style={{
          opacity: activeMedia.type === 'video' ? opacity * 1.25 : opacity * 0.45,
          filter: `blur(${Math.max(4, blurAmount - 4)}px)`,
        }}
      />

      {/* ── Subtle Film Grain Texture ── */}
      {showGrain && <div className="immersive-grain-overlay" />}

      {/* ── Deep Vignette Mask (Ensures Foreground Cards Pop) ── */}
      <div 
        className="immersive-vignette-overlay" 
        style={{
          background: `radial-gradient(ellipse at 50% 38%, transparent 12%, rgba(9, 13, 20, ${vignetteIntensity}) 80%, rgba(9, 13, 20, 0.96) 100%)`
        }}
      />

      {/* ── Unobtrusive Minimalist Story Pill (Subtle Supporting Role) ── */}
      <div className="subtle-story-indicator glass-panel">
        <div className="indicator-left">
          <FontAwesomeIcon icon={activeMedia.icon} className="indicator-icon" />
          <div className="indicator-text-block">
            <span className="indicator-tag">{activeMedia.tag}: {activeMedia.title}</span>
            <span className="indicator-sub">{activeMedia.subtitle}</span>
          </div>
        </div>

        <div className="indicator-controls">
          <button 
            type="button" 
            onClick={handlePrev}
            className="mini-ctrl-btn"
            title="Previous scene"
            aria-label="Previous scene"
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button 
            type="button" 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`mini-ctrl-btn ${isPlaying ? 'active' : ''}`}
            title={isPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}
            aria-label={isPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
          <button 
            type="button" 
            onClick={handleNext}
            className="mini-ctrl-btn"
            title="Next scene"
            aria-label="Next scene"
          >
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>
      </div>

      {/* ── Foreground Content & Calibration Deck ── */}
      <div className="immersive-content-container">
        
        {/* Header Ribbon */}
        <div className="immersive-test-header">
          <div className="test-badge">
            <FontAwesomeIcon icon={faSun} className="badge-icon-warm" />
            <span>Subtle Supporting Background</span>
          </div>
          <h1 className="immersive-title">Atmospheric Depth & Clarity</h1>
          <p className="immersive-subtitle">
            Warm, diffused imagery supporting the interface without competing for attention. Clean dark contrast with delicate human warmth.
          </p>
        </div>

        {/* ── 3-Item Media Selector ── */}
        <div className="media-selector-strip glass-panel">
          {mediaCollection.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={`media-select-btn ${activeMediaIndex === idx ? 'active' : ''}`}
              onClick={() => {
                setActiveMediaIndex(idx);
                setIsPlaying(false);
              }}
            >
              <div className="media-btn-icon">
                <FontAwesomeIcon icon={item.type === 'video' ? faVideo : faImage} />
              </div>
              <div className="media-btn-info">
                <span className="btn-tag">{item.tag}</span>
                <span className="btn-name">{item.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* ── Interactive Calibration Console ── */}
        <div className="test-control-console glass-panel">
          <div className="console-heading">
            <FontAwesomeIcon icon={faSliders} />
            <h3>Optical Balance & Restraint</h3>
          </div>

          <div className="controls-grid">
            {/* Opacity */}
            <div className="control-field">
              <div className="field-meta">
                <label>Backdrop Opacity (Subtle)</label>
                <span className="field-val">{Math.round(opacity * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="0.85" 
                step="0.02" 
                value={opacity} 
                onChange={(e) => setOpacity(parseFloat(e.target.value))} 
                className="slider-input"
              />
            </div>

            {/* Gaussian Blur */}
            <div className="control-field">
              <div className="field-meta">
                <label>Dream Blur (Softness)</label>
                <span className="field-val">{blurAmount}px</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="24" 
                step="1" 
                value={blurAmount} 
                onChange={(e) => setBlurAmount(parseInt(e.target.value, 10))} 
                className="slider-input"
              />
            </div>

            {/* Vignette Depth */}
            <div className="control-field">
              <div className="field-meta">
                <label>Vignette Darkness</label>
                <span className="field-val">{Math.round(vignetteIntensity * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.3" 
                max="0.95" 
                step="0.05" 
                value={vignetteIntensity} 
                onChange={(e) => setVignetteIntensity(parseFloat(e.target.value))} 
                className="slider-input"
              />
            </div>

            {/* Ken Burns & Grain Toggles */}
            <div className="control-field">
              <div className="field-meta">
                <label>Motion & Texture</label>
              </div>
              <div className="toggle-sub-row">
                <button 
                  type="button" 
                  className={`toggle-chip ${kenBurns ? 'active' : ''}`}
                  onClick={() => setKenBurns(!kenBurns)}
                >
                  Slow Drift: {kenBurns ? 'ON' : 'OFF'}
                </button>
                <button 
                  type="button" 
                  className={`toggle-chip ${showGrain ? 'active' : ''}`}
                  onClick={() => setShowGrain(!showGrain)}
                >
                  Grain: {showGrain ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sample Foreground Cards (Demonstrating Contrast) ── */}
        {showCards && (
          <div className="test-cards-bento">
            <div className="bento-glass-card primary-card">
              <div className="card-top-icon">
                <FontAwesomeIcon icon={faShieldHalved} />
              </div>
              <h3>Immutable Cold-Chain Verification</h3>
              <p>
                Temperature sensors continuously stream zero-knowledge cryptographic proof of biological stability without exposing sensitive logistical routes.
              </p>
              <div className="card-action-row">
                <button className="sample-cta-btn">
                  Inspect Block #1984201 <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>

            <div className="bento-glass-card metric-card">
              <div className="metric-header">
                <FontAwesomeIcon icon={faHeartPulse} className="text-emerald" />
                <span className="live-pulse">LIVE NODE</span>
              </div>
              <div className="metric-number">4.2°C</div>
              <div className="metric-desc">Cold-chain stability locked within optimal biologic range.</div>
            </div>

            <div className="bento-glass-card telemetry-card">
              <div className="metric-header">
                <FontAwesomeIcon icon={faMicrochip} className="text-cyan" />
                <span>CONSENSUS AUDIT</span>
              </div>
              <div className="metric-number">100%</div>
              <div className="metric-desc">Zero counterfeit anomalies or temperature breaches detected.</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ImmersiveBackdropTest;
