import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faBoxOpen,
  faArrowRight,
  faLink,
  faShieldHalved,
  faPills,
} from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../../context/CartContext';
import './CheckoutSuccess.css';

const CheckoutSuccess = () => {
  const { clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const mockTxHash = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  return (
    <div className="checkout-success-page container animate-fade-in">
      <div className="success-card card">
        {/* Animated Check Icon */}
        <div className="success-icon-orbit">
          <div className="success-icon-core">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
        </div>

        <span className="section-eyebrow text-emerald">Smart Contract Escrow Locked</span>
        <h1 className="success-title">Order Authenticated & Staged!</h1>
        <p className="success-desc">
          Your pharmaceutical order has been verified by smart contract consensus. The manufacturer node has been notified to prepare the cold-chain dispatch.
        </p>

        {/* Blockchain Receipt Box */}
        <div className="receipt-telemetry-box">
          <div className="receipt-row">
            <span className="receipt-label">Blockchain Receipt Hash:</span>
            <span className="receipt-val mono-text">{mockTxHash.slice(0, 18)}...{mockTxHash.slice(-8)}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Shipment Status:</span>
            <span className="receipt-val text-emerald">
              <span className="pulse-dot success" style={{ width: '6px', height: '6px', marginRight: '6px' }}></span>
              Staged for Cold-Chain Pickup
            </span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Integrity Protocol:</span>
            <span className="receipt-val">256-Bit Multi-Sig Escrow</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="success-actions-cluster">
          <Link to="/my-orders" className="btn btn-primary btn-lg">
            <FontAwesomeIcon icon={faBoxOpen} />
            <span>Track in My Shipments</span>
          </Link>

          <Link to="/products" className="btn btn-outline btn-lg">
            <FontAwesomeIcon icon={faPills} />
            <span>Browse More Medicines</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
