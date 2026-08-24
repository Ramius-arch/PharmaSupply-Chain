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
  faFilm,
  faHandHoldingHeart,
  faSnowflake,
  faUsers,
  faFlask
} from '@fortawesome/free-solid-svg-icons';

import storyCare from '../assets/story-1-human-care.jpg';
import storyCold from '../assets/story-2-cold-chain.jpg';
import storyHope from '../assets/story-3-healing-hope.jpg';
import storyApothecary from '../assets/story-4-apothecary.jpg';
import ambientBokeh from '../assets/warm-nostalgic-backdrop.jpg';

import './ImmersiveBackdropTest.css';

const storyChapters = [
  {
    id: 'chapter-1',
    title: 'Chapter I: The Human Touch',
    subtitle: 'Reassurance at the bedside',
    narrative: 'Behind every batch number and sealed blister pack is a person seeking relief, and a compassionate hand offering reassurance in the morning sun.',
    image: storyCare,
    icon: faHandHoldingHeart,
    location: 'St. Jude Clinical Oncology • 08:30 AM',
    metric: 'Patient Dispensation Confirmed',
  },
  {
    id: 'chapter-2',
    title: 'Chapter II: The Cold-Chain Vigil',
    subtitle: 'Preserving life through sub-zero vapor',
    narrative: 'From cryogenic synthesis to twilight courier transit, sub-zero thermal chambers guard fragile mRNA molecules across thousands of miles.',
    image: storyCold,
    icon: faSnowflake,
    location: 'Bio-Logistics Cold Hub • -78.4°C Ambient',
    metric: 'Zero Thermal Excursions Logged',
  },
  {
    id: 'chapter-3',
    title: 'Chapter III: Life, Restored',
    subtitle: 'The laughter in autumn light',
    narrative: 'When supply chains never break, families take long walks in golden afternoon parks. Genuine medicine restores the moments that matter most.',
    image: storyHope,
    icon: faUsers,
    location: 'Recovered Patient Community • Golden Hour',
    metric: '100% Provenance Authenticity',
  },
  {
    id: 'chapter-4',
    title: 'Chapter IV: The Apothecary’s Craft',
    subtitle: 'Centuries of precision formulation',
    narrative: 'From historic amber apothecary bottles to decentralized cryptographic hashes, the sacred covenant between chemist and patient remains unbroken.',
    image: storyApothecary,
    icon: faFlask,
    location: 'Research Node BioSynthetics • Lab #02',
    metric: 'Spectrophotometry Purity 99.98%',
  },
  {
    id: 'chapter-5',
    title: 'Chapter V: Golden Hour Diffusion',
    subtitle: 'Intimate ambient warmth',
    narrative: 'Pure nostalgic emotional depth—diffused golden bokeh and warm light textures that ground complex distributed ledgers in human warmth.',
    image: ambientBokeh,
    icon: faSun,
    location: 'Global Sensor Matrix • Ambient Mode',
    metric: 'Decentralized Network Nominal',
  },
];

const ImmersiveBackdropTest = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlayingStory, setIsPlayingStory] = useState(true);
  const [opacity, setOpacity] = useState(0.88);
  const [blurAmount, setBlurAmount] = useState(0);
  const [blendMode, setBlendMode] = useState('normal');
  const [showGrain, setShowGrain] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [kenBurns, setKenBurns] = useState(true);
  const [vignetteIntensity, setVignetteIntensity] = useState(0.48);
  const [showCards, setShowCards] = useState(true);
  const [fullBleed, setFullBleed] = useState(false);

  const canvasRef = useRef(null);
  const activeChapter = storyChapters[activeChapterIndex];

  // Auto-advance narrative story loop
  useEffect(() => {
    if (!isPlayingStory) return;
    const interval = setInterval(() => {
      setActiveChapterIndex((prev) => (prev + 1) % storyChapters.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [isPlayingStory]);

  // Ambient floating dust particles & golden light leaks on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !showParticles) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.45 - 0.15,
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      hue: Math.random() > 0.4 ? 'rgba(255, 190, 90,' : 'rgba(255, 235, 170,',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render subtle warm light leak gradient drifting
      const time = Date.now() * 0.0004;
      const leakX = width * (0.35 + Math.sin(time) * 0.15);
      const leakY = height * (0.3 + Math.cos(time * 0.8) * 0.1);
      const leakGrad = ctx.createRadialGradient(leakX, leakY, 10, leakX, leakY, width * 0.65);
      leakGrad.addColorStop(0, 'rgba(255, 160, 50, 0.06)');
      leakGrad.addColorStop(0.5, 'rgba(255, 110, 0, 0.02)');
      leakGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = leakGrad;
      ctx.fillRect(0, 0, width, height);

      // Render drifting sun motes
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += Math.sin(time * 10 * p.pulseSpeed) * 0.008;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const alpha = Math.max(0.05, Math.min(0.75, p.opacity));
        ctx.fillStyle = `${p.hue} ${alpha})`;
        ctx.shadowColor = 'rgba(255, 170, 50, 0.6)';
        ctx.shadowBlur = 8;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showParticles]);

  const handleNextChapter = () => {
    setActiveChapterIndex((prev) => (prev + 1) % storyChapters.length);
  };

  const handlePrevChapter = () => {
    setActiveChapterIndex((prev) => (prev - 1 + storyChapters.length) % storyChapters.length);
  };

  return (
    <div className={`immersive-test-stage ${fullBleed ? 'full-bleed-mode' : ''}`}>
      {/* ── Visual Storytelling Image / Video Canvas Layer ── */}
      <div 
        className={`immersive-image-layer ${kenBurns ? 'ken-burns-active' : ''}`}
        style={{
          backgroundImage: `url(${activeChapter.image})`,
          opacity: opacity,
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
          mixBlendMode: blendMode,
        }}
      />

      {/* ── Procedural Golden Particles & Ambient Light Leaks ── */}
      {showParticles && (
        <canvas ref={canvasRef} className="ambient-particles-canvas" />
      )}

      {/* ── Analogue Film Grain Overlay ── */}
      {showGrain && <div className="immersive-grain-overlay" />}

      {/* ── Cinematic Radial Vignette ── */}
      <div 
        className="immersive-vignette-overlay" 
        style={{
          background: `radial-gradient(ellipse at 50% 40%, transparent 15%, rgba(9, 13, 20, ${vignetteIntensity}) 85%, rgba(9, 13, 20, 0.95) 100%)`
        }}
      />

      {/* ── Narrative Caption Overlay (Bottom Story Ribbon) ── */}
      <div className="narrative-bottom-ribbon">
        <div className="narrative-badge">
          <FontAwesomeIcon icon={activeChapter.icon} className="narrative-icon" />
          <span>{activeChapter.location}</span>
        </div>
        <h2 className="narrative-heading">{activeChapter.title}</h2>
        <p className="narrative-text">{activeChapter.narrative}</p>
        <div className="narrative-metric-pill">
          <span className="pulse-dot-emerald"></span>
          <span>{activeChapter.metric}</span>
        </div>
      </div>

      {/* ── Content Container & Controls ── */}
      <div className="immersive-content-container">
        
        {/* Header Ribbon */}
        <div className="immersive-test-header">
          <div className="test-badge">
            <FontAwesomeIcon icon={faSun} className="badge-icon-warm" />
            <span>Subtle & Intimate Storytelling</span>
          </div>
          <h1 className="immersive-title">Atmosphere & Visual Narrative</h1>
          <p className="immersive-subtitle">
            Warm, vivid imagery and slow cinematic textures communicating human care and cold-chain integrity behind every verified pharmaceutical unit.
          </p>
        </div>

        {/* ── Story Chapter Playlist Carousel Bar ── */}
        <div className="story-playlist-bar glass-panel">
          <div className="playlist-header">
            <div className="playlist-title">
              <FontAwesomeIcon icon={faFilm} />
              <span>Story Chapters ({activeChapterIndex + 1}/{storyChapters.length})</span>
            </div>
            <div className="playlist-playback-controls">
              <button 
                type="button" 
                onClick={handlePrevChapter}
                className="playback-btn"
                title="Previous Chapter"
                aria-label="Previous Chapter"
              >
                <FontAwesomeIcon icon={faBackward} />
              </button>
              <button 
                type="button" 
                onClick={() => setIsPlayingStory(!isPlayingStory)}
                className={`playback-btn play-pause-btn ${isPlayingStory ? 'active' : ''}`}
                title={isPlayingStory ? 'Pause Story Flow' : 'Play Story Flow'}
                aria-label={isPlayingStory ? 'Pause Story Flow' : 'Play Story Flow'}
              >
                <FontAwesomeIcon icon={isPlayingStory ? faPause : faPlay} />
                <span>{isPlayingStory ? 'Auto-Advancing' : 'Paused'}</span>
              </button>
              <button 
                type="button" 
                onClick={handleNextChapter}
                className="playback-btn"
                title="Next Chapter"
                aria-label="Next Chapter"
              >
                <FontAwesomeIcon icon={faForward} />
              </button>
            </div>
          </div>

          <div className="chapters-strip">
            {storyChapters.map((chap, idx) => (
              <button
                key={chap.id}
                type="button"
                className={`chapter-card-btn ${activeChapterIndex === idx ? 'active' : ''}`}
                onClick={() => {
                  setActiveChapterIndex(idx);
                  setIsPlayingStory(false);
                }}
              >
                <div 
                  className="chapter-thumb-bg"
                  style={{ backgroundImage: `url(${chap.image})` }}
                />
                <div className="chapter-meta">
                  <span className="chap-num">0{idx + 1}</span>
                  <span className="chap-title">{chap.title.split(':')[1] || chap.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Interactive Controls Floating Console ── */}
        <div className="test-control-console glass-panel">
          <div className="console-heading">
            <FontAwesomeIcon icon={faSliders} />
            <h3>Cinematic Texture & Lighting Controls</h3>
          </div>

          <div className="controls-grid">
            {/* Opacity */}
            <div className="control-field">
              <div className="field-meta">
                <label>Vivid Warmth Opacity</label>
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

            {/* Gaussian Softness */}
            <div className="control-field">
              <div className="field-meta">
                <label>Gaussian Dream Blur</label>
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
                <label>Vignette Shadow Mask</label>
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
              className={`toggle-chip ${kenBurns ? 'active' : ''}`}
              onClick={() => setKenBurns(!kenBurns)}
            >
              <FontAwesomeIcon icon={faFilm} /> Ken Burns Pan: {kenBurns ? 'SLOW' : 'OFF'}
            </button>
            <button 
              type="button" 
              className={`toggle-chip ${showParticles ? 'active' : ''}`}
              onClick={() => setShowParticles(!showParticles)}
            >
              <FontAwesomeIcon icon={faSun} /> Sun Dust Particles: {showParticles ? 'ON' : 'OFF'}
            </button>
            <button 
              type="button" 
              className={`toggle-chip ${showGrain ? 'active' : ''}`}
              onClick={() => setShowGrain(!showGrain)}
            >
              <FontAwesomeIcon icon={faLayerGroup} /> 35mm Film Grain: {showGrain ? 'ON' : 'OFF'}
            </button>
            <button 
              type="button" 
              className={`toggle-chip ${showCards ? 'active' : ''}`}
              onClick={() => setShowCards(!showCards)}
            >
              <FontAwesomeIcon icon={faEye} /> Sample UI Cards: {showCards ? 'ON' : 'OFF'}
            </button>
            <button 
              type="button" 
              className={`toggle-chip ${fullBleed ? 'active' : ''}`}
              onClick={() => setFullBleed(!fullBleed)}
            >
              <FontAwesomeIcon icon={faExpand} /> {fullBleed ? 'Exit Cinema View' : 'Full Cinema View'}
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
