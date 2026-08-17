import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPills, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import './OrderSummary.css';

const OrderSummary = ({ items = [], totalAmount = 0 }) => {
  return (
    <div className="order-summary-box">
      <div className="order-summary-items-list">
        {items.map((item) => {
          const itemPrice = item.unitPrice !== undefined 
            ? item.unitPrice 
            : (item.price > 100 ? item.price / 100 : item.price) || 0;

          return (
            <div key={item.id} className="summary-item-row">
              <div className="summary-item-lead">
                <FontAwesomeIcon icon={faPills} className="text-orange" />
                <div>
                  <span className="summary-item-name">{item.name}</span>
                  <span className="summary-item-qty">Qty: {item.quantity} units</span>
                </div>
              </div>
              <span className="summary-item-val mono-text">
                ${(itemPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="summary-divider" />

      <div className="summary-cost-breakdown">
        <div className="cost-row">
          <span>Subtotal</span>
          <span className="mono-text">${(totalAmount > 100 ? totalAmount / 100 : totalAmount).toFixed(2)}</span>
        </div>
        <div className="cost-row">
          <span>Cold-Chain IoT Telemetry</span>
          <span className="text-emerald font-semibold">Included ($0.00)</span>
        </div>
        <div className="cost-row">
          <span>Protocol Gas Fee</span>
          <span className="text-cyan font-semibold">Subsidized ($0.00)</span>
        </div>
      </div>

      <div className="summary-divider" />

      <div className="summary-total-footer">
        <span className="total-title">Total Due:</span>
        <span className="total-val mono-text">${(totalAmount > 100 ? totalAmount / 100 : totalAmount).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
