import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faTruckFast,
  faMicrochip,
  faArrowRight,
  faCube,
  faCheckCircle,
  faLock,
  faTemperatureHalf,
  faHospital,
  faFlask,
  faFileContract,
  faFingerprint,
  faBolt,
  faNetworkWired,
  faCircleNodes,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import productService from '../../api/productService';
import LoadingSpinner from '../UI/LoadingSpinner';
import EmptyState from '../UI/EmptyState';
import ProductCard from '../ProductCard/ProductCard';
import './Home.css';

const pipelineStages = [
  {
    id: 1,
    step: 'Stage 01',
    title: 'Lab Synthesis & Assay',
    role: 'Manufacturer Node',
    icon: faFlask,
    color: 'var(--accent-primary)',
    bgSoft: 'var(--primary-soft)',
    hash: '0x8f2d...c941',
    description: 'Chemical purity, molecular strength, and manufacturer batch records are sealed with private key signatures.',
    telemetry: { purity: '99.8%', temp: '21.4°C', validator: 'Pfizer BioNode #04', gas: '42,100 gwei' }
  },
  {
    id: 2,
    step: 'Stage 02',
    title: 'On-Chain Batch Minting',
    role: 'Smart Contract EVM',
    icon: faFileContract,
    color: 'var(--accent-cyan)',
    bgSoft: 'var(--info-soft)',
    hash: '0x3a9b...77e2',
    description: 'Immutable ERC batch token is minted to the distributed ledger, locking serial numbers and expiration dates.',
    telemetry: { block: '#1984201', contract: 'PharmaCore.sol', integrity: 'Verified 100%', gas: '68,400 gwei' }
  },
  {
    id: 3,
    step: 'Stage 03',
    title: 'IoT Cold-Chain Transit',
    role: 'Courier Custody',
    icon: faTruckFast,
    color: 'var(--accent-amber)',
    bgSoft: 'var(--warning-soft)',
    hash: '0xbd10...44a9',
    description: 'Real-time GPS coordinates and temperature sensors continuously post verified telemetry checkpoints.',
    telemetry: { coldChain: '4.2°C Stable', gps: '40.7128°N, 74.0060°W', checkpoint: 'Hub JFK-09', transit: 'In-Transit' }
  },
  {
    id: 4,
    step: 'Stage 04',
    title: 'Hospital Dispensation',
    role: 'Dispenser & Patient',
    icon: faHospital,
    color: 'var(--accent-emerald)',
    bgSoft: 'var(--success-soft)',
    hash: '0x11c8...f93e',
    description: 'Pharmacist cryptographically validates provenance QR and updates blockchain status to Delivered prior to dispensing.',
    telemetry: { verification: 'Passed', status: 'Delivered', recipient: 'Mayo Clinic Pharmacy', auth: 'Multi-Sig OK' }
  },
];

const bentoFeatures = [
  {
    icon: faFingerprint,
    title: 'Cryptographic Anti-Counterfeit',
    subtitle: 'Zero-knowledge verification',
    desc: 'Each blister pack and vial carries a unique cryptographic identifier that cannot be cloned or re-minted without private key authority.',
    color: 'var(--accent-primary)',
    colSpan: 'normal',
  },
  {
    icon: faTemperatureHalf,
    title: 'IoT Cold-Chain Provenance',
    subtitle: 'Autonomous anomaly detection',
    desc: 'Smart contracts automatically flag or quarantine batches if thermal sensors breach critical storage thresholds during transit.',
    color: 'var(--accent-cyan)',
    colSpan: 'normal',
  },
  {
    icon: faBolt,
    title: 'Sub-Second Emergency Recall',
    subtitle: 'Instant network isolation',
    desc: 'Regulators and manufacturers can decommission compromised lots network-wide in a single transaction, stopping dispensing globally.',
    color: 'var(--accent-rose)',
    colSpan: 'normal',
  },
  {
    icon: faNetworkWired,
    title: 'Multi-Role Consensus Network',
    subtitle: 'RBAC On-Chain Governance',
    desc: 'Separate cryptographic privileges for Suppliers, Transport Nodes, Regulators, and Dispensers ensure absolute operational integrity.',
    color: 'var(--accent-emerald)',
    colSpan: 'normal',
  },
];

const Home = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStage, setActiveStage] = useState(pipelineStages[0]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setError('Unable to load featured catalog.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const canAccessAdmin = user?.role === 'admin' || user?.role === 'supplier';

  return (
    <div className="home-experience animate-fade-in">
      {/* ─── Hero Section ───────────────────────────────────── */}
      <section className="hero-cyber">
        <div className="container">
          <div className="hero-mesh-content">
            {/* Top Badge */}
            <div className="hero-status-pill">
              <span className="pulse-dot emerald"></span>
              <span className="pill-text">Autonomous Blockchain Traceability v2.4</span>
              <span className="pill-divider">·</span>
              <span className="pill-highlight">Zero Counterfeit Guarantee</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-main-title">
              The Cryptographic Backbone for <span className="gradient-highlight">Pharmaceutical Provenance</span>
            </h1>

            {/* Subtext */}
            <p className="hero-lead-text">
              Track medicine batches from synthesis lab to patient bedside with immutable smart contracts, real-time IoT thermal logging, and decentralized ledger consensus.
            </p>

            {/* Kinetic Action Buttons */}
            <div className="hero-cta-cluster">
              <Link to="/products" className="btn btn-primary btn-lg">
                <span>Explore Medicine Catalog</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
              
              {isAuthenticated ? (
                <Link to={canAccessAdmin ? "/admin" : "/dashboard"} className="btn btn-outline btn-lg">
                  <FontAwesomeIcon icon={faShieldAlt} />
                  <span>{canAccessAdmin ? "Admin Control Center" : "Station Dashboard"}</span>
                </Link>
              ) : (
                <Link to="/register" className="btn btn-outline btn-lg">
                  <FontAwesomeIcon icon={faCircleNodes} />
                  <span>Connect Node Station</span>
                </Link>
              )}
            </div>

            {/* Live Metrics Ribbon */}
            <div className="metrics-ribbon card">
              <div className="metric-cell">
                <span className="metric-number text-emerald">100%</span>
                <span className="metric-label">Ledger Verified</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-cell">
                <span className="metric-number text-cyan">&lt; 1.2s</span>
                <span className="metric-label">Contract Execution</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-cell">
                <span className="metric-number text-orange">256-Bit</span>
                <span className="metric-label">ECDSA Security</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-cell">
                <span className="metric-number">0</span>
                <span className="metric-label">Tampered Batches</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Interactive Supply Chain Pipeline ───────────────── */}
      <section className="pipeline-section">
        <div className="container">
          <div className="section-head-center">
            <span className="section-eyebrow">Interactive Verification Pipeline</span>
            <h2 className="section-title">How Every Batch Moves On-Chain</h2>
            <p className="section-subtitle">
              Click any stage in the supply chain lifecycle to inspect live cryptographic telemetry and smart contract checkpoints.
            </p>
          </div>

          <div className="pipeline-interactive-box card">
            {/* Steps Navigation Bar */}
            <div className="pipeline-stepper-grid">
              {pipelineStages.map((stage) => {
                const isSelected = activeStage.id === stage.id;
                return (
                  <button
                    key={stage.id}
                    className={`pipeline-step-tab ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveStage(stage)}
                    style={{ '--stage-color': stage.color }}
                  >
                    <div className="step-badge-row">
                      <span className="step-num">{stage.step}</span>
                      <div className="step-icon-circle" style={{ color: stage.color, background: stage.bgSoft }}>
                        <FontAwesomeIcon icon={stage.icon} />
                      </div>
                    </div>
                    <div className="step-title-block">
                      <h4 className="step-title">{stage.title}</h4>
                      <span className="step-role">{stage.role}</span>
                    </div>
                    {isSelected && <div className="step-active-indicator" style={{ background: stage.color }} />}
                  </button>
                );
              })}
            </div>

            {/* Stage Deep Dive Inspector */}
            <div className="pipeline-inspector animate-scale-in" key={activeStage.id}>
              <div className="inspector-grid">
                <div className="inspector-info">
                  <div className="inspector-header">
                    <span className="status-chip primary" style={{ color: activeStage.color, borderColor: activeStage.color }}>
                      {activeStage.step} Inspection
                    </span>
                    <span className="inspector-hash mono-text">Tx Hash: {activeStage.hash}</span>
                  </div>
                  <h3 className="inspector-title">{activeStage.title}</h3>
                  <p className="inspector-desc">{activeStage.description}</p>
                </div>

                <div className="inspector-telemetry-panel">
                  <h4 className="telemetry-panel-title">
                    <FontAwesomeIcon icon={faShieldAlt} style={{ color: activeStage.color }} />
                    On-Chain State Telemetry
                  </h4>
                  <div className="telemetry-data-grid">
                    {Object.entries(activeStage.telemetry).map(([key, val]) => (
                      <div key={key} className="telemetry-data-item">
                        <span className="telemetry-key">{key.toUpperCase()}:</span>
                        <span className="telemetry-value mono-text">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── High-Tech Bento Grid Features ───────────────────── */}
      <section className="bento-features-section">
        <div className="container">
          <div className="section-head-center">
            <span className="section-eyebrow">Enterprise Security Architecture</span>
            <h2 className="section-title">Built for Mission-Critical Logistics</h2>
            <p className="section-subtitle">
              Engineered with zero-trust cryptographic protocols to safeguard life-saving pharmaceuticals.
            </p>
          </div>

          <div className="bento-grid">
            {bentoFeatures.map((feat, idx) => (
              <div key={idx} className="bento-card card card-interactive">
                <div className="bento-icon-wrapper" style={{ color: feat.color }}>
                  <FontAwesomeIcon icon={feat.icon} />
                </div>
                <div className="bento-content">
                  <span className="bento-subtitle" style={{ color: feat.color }}>{feat.subtitle}</span>
                  <h3 className="bento-title">{feat.title}</h3>
                  <p className="bento-desc">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Verified Pharmaceuticals ──────────────── */}
      <section className="featured-catalog-section">
        <div className="container">
          <div className="catalog-header-flex">
            <div>
              <span className="section-eyebrow">Verified Registry</span>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '8px' }}>
                Featured Pharmaceuticals
              </h2>
              <p className="section-subtitle" style={{ textAlign: 'left', margin: 0 }}>
                Authentic batches verified by smart contracts ready for hospital distribution.
              </p>
            </div>
            <Link to="/products" className="btn btn-outline hidden-mobile">
              <span>View Full Catalog</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Querying verified inventory from blockchain..." />
          ) : error ? (
            <EmptyState
              icon={faCube}
              title="Catalog Node Syncing"
              description={error}
              action={<Link to="/products" className="btn btn-outline">Explore Products</Link>}
            />
          ) : products.length === 0 ? (
            <EmptyState
              icon={faCube}
              title="No Products Initialized"
              description="The pharmaceutical inventory ledger is currently empty."
              action={<Link to="/products" className="btn btn-primary">Browse Catalog</Link>}
            />
          ) : (
            <div className="featured-grid stagger-children">
              {products.slice(0, 3).map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={{
                    id: product._id || product.id,
                    name: product.name,
                    price: product.unitPrice ?? product.price ?? 0,
                    image: product.image,
                    category: product.category,
                    manufacturer: product.manufacturer,
                    quantityInStock: product.quantityInStock,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
