import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faCube,
  faBuilding,
  faLock,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import './PaymentForm.css';

const PaymentForm = ({ method, onChange }) => {
  return (
    <div className="payment-form-container">
      {/* Payment Method Selector Tabs */}
      <div className="payment-method-selector">
        <label className={`payment-method-option ${method === 'crypto' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="crypto"
            checked={method === 'crypto'}
            onChange={onChange}
          />
          <div className="option-content">
            <FontAwesomeIcon icon={faCube} className="option-icon text-cyan" />
            <div>
              <strong className="option-title">Smart Contract Escrow (Web3)</strong>
              <span className="option-desc">Automated release upon delivery scan</span>
            </div>
          </div>
        </label>

        <label className={`payment-method-option ${method === 'credit' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="credit"
            checked={method === 'credit'}
            onChange={onChange}
          />
          <div className="option-content">
            <FontAwesomeIcon icon={faCreditCard} className="option-icon text-orange" />
            <div>
              <strong className="option-title">Credit / Corporate Card</strong>
              <span className="option-desc">Instant 256-bit encrypted checkout</span>
            </div>
          </div>
        </label>

        <label className={`payment-method-option ${method === 'invoice' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="invoice"
            checked={method === 'invoice'}
            onChange={onChange}
          />
          <div className="option-content">
            <FontAwesomeIcon icon={faBuilding} className="option-icon text-emerald" />
            <div>
              <strong className="option-title">Institutional Net-30 Invoicing</strong>
              <span className="option-desc">Automated purchase order matching</span>
            </div>
          </div>
        </label>
      </div>

      {/* Method Details */}
      {method === 'crypto' && (
        <div className="payment-details-card animate-scale-in">
          <div className="crypto-wallet-notice">
            <FontAwesomeIcon icon={faCheckCircle} className="text-emerald" />
            <div>
              <strong>Local Signer Ready</strong>
              <p>Your transaction will interact directly with the local Hardhat/Sepolia node.</p>
            </div>
          </div>
        </div>
      )}

      {method === 'credit' && (
        <div className="payment-details-card animate-scale-in">
          <div className="input-group">
            <label>Card Number</label>
            <input type="text" placeholder="4532 •••• •••• 8821" defaultValue="4532 9182 3409 8821" />
          </div>
          <div className="grid-2">
            <div className="input-group">
              <label>Expires (MM/YY)</label>
              <input type="text" placeholder="12/28" defaultValue="12/28" />
            </div>
            <div className="input-group">
              <label>Security CVV</label>
              <input type="password" placeholder="•••" defaultValue="892" />
            </div>
          </div>
        </div>
      )}

      {method === 'invoice' && (
        <div className="payment-details-card animate-scale-in">
          <div className="input-group">
            <label>Purchase Order (PO) Number</label>
            <input type="text" placeholder="PO-2026-PHARMA-0982" defaultValue="PO-2026-PHARMA-0982" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
