import React from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../ContactForm/ContactForm';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero animate-fade-in">
        <div className="container">
          <div className="hero-content">
            <h1>Deterministic Pharma Integrity</h1>
            <p>Eliminate supply chain ambiguity with decentralized traceability. Secure, transparent, and built for high-stakes pharmaceutical logistics.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/products" className="btn btn-primary">Audit Catalog</Link>
              <Link to="/admin" className="btn btn-outline">Control Center</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Transparency as a Standard</h2>
          <div className="category-grid">
            <div className="category-card">
              <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>🛡️</div>
              <h3>Immutable Ledger</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Zero-trust validation. Every batch movement is cryptographically signed and logged on-chain.</p>
            </div>
            <div className="category-card">
              <div style={{ fontSize: '2rem', color: 'var(--secondary)' }}>📦</div>
              <h3>Live Asset Tracking</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Sub-second updates. Monitor the lifecycle of critical assets from synthesis to delivery.</p>
            </div>
            <div className="category-card">
              <div style={{ fontSize: '2rem', color: 'var(--warning)' }}>⚡</div>
              <h3>Smart Logistics</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Automated compliance. Smart contracts enforce status transitions, reducing human intervention.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2>Verified Inventory</h2>
          <div className="product-grid">
            {[
                { id: 1, name: 'Adalimumab Batch 7', price: 125000, img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=600&auto=format&fit=crop' },
                { id: 2, name: 'Insulin Glargine R4', price: 45000, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop' },
                { id: 3, name: 'Pembrolizumab S12', price: 89000, img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop' }
            ].map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.img} alt={product.name} />
                <h3>{product.name}</h3>
                <div className="price">${(product.price / 100).toLocaleString()}</div>
                <Link to={`/products/${product.id}`} className="btn btn-outline" style={{ marginTop: '16px', width: '100%' }}>Audit Details</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactForm />
    </div>
  );
};

export default Home;
