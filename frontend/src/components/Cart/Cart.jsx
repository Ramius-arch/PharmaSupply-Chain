import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
  faArrowRight,
  faShoppingCart,
  faShieldHalved,
  faLock,
  faPlus,
  faMinus,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page-container container animate-fade-in">
        <div className="card empty-cart-card">
          <div className="empty-cart-icon-box">
            <FontAwesomeIcon icon={faShoppingCart} />
          </div>
          <h2>Your Shipment Cart is Empty</h2>
          <p>You have not staged any verified pharmaceutical lots for dispatch.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            <span>Browse Medicine Catalog</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>
    );
  }

  // Calculate items total safely
  const subtotal = cartItems.reduce((acc, item) => {
    const p = item.unitPrice !== undefined ? item.unitPrice : (item.price > 100 ? item.price / 100 : item.price) || 0;
    return acc + p * item.quantity;
  }, 0);

  const protocolGasEst = 0.00; // Zero gas subsidised by network
  const totalAmount = subtotal + protocolGasEst;

  return (
    <div className="cart-page-container container animate-fade-in">
      <div className="cart-header-row">
        <div>
          <span className="section-eyebrow">Staged Shipments</span>
          <h1 className="cart-headline">Shipment Manifest Cart</h1>
          <p className="cart-subheadline">Review staged batches before locking escrow and initiating blockchain logistics.</p>
        </div>
        <button onClick={clearCart} className="btn btn-outline btn-sm clear-cart-btn">
          <FontAwesomeIcon icon={faTrashAlt} />
          <span>Clear Manifest</span>
        </button>
      </div>

      <div className="cart-split-layout">
        {/* Left: Cart Items List */}
        <div className="cart-items-column">
          <div className="cart-items-card card">
            <h3 className="cart-section-title">
              Staged Pharmaceuticals ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Units)
            </h3>

            <div className="cart-item-list">
              {cartItems.map((item) => {
                const itemPrice = item.unitPrice !== undefined 
                  ? item.unitPrice 
                  : (item.price > 100 ? item.price / 100 : item.price) || 0;
                const img = item.image || `https://picsum.photos/seed/${item.id}/400/300?grayscale`;

                return (
                  <div key={item.id} className="cart-item-row">
                    <img src={img} alt={item.name} className="cart-item-thumb" />
                    
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">
                        <Link to={`/products/${item.id}`}>{item.name}</Link>
                      </h4>
                      <div className="cart-item-meta">
                        {item.category && <span className="item-chip">{item.category}</span>}
                        <span className="item-unit-price mono-text">${itemPrice.toFixed(2)} / unit</span>
                      </div>
                    </div>

                    {/* Quantity Modifier */}
                    <div className="cart-item-quantity">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <span className="cart-qty-val">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantityInStock !== undefined && item.quantity >= item.quantityInStock}
                        aria-label="Increase quantity"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="cart-item-total-col">
                      <span className="cart-item-total mono-text">
                        ${(itemPrice * item.quantity).toFixed(2)}
                      </span>
                      <button
                        className="cart-item-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Escrow Summary Panel */}
        <div className="cart-summary-column">
          <div className="cart-summary-card card">
            <h3 className="cart-section-title">Order Ledger Summary</h3>

            <div className="summary-line-item">
              <span>Batch Manifest Subtotal</span>
              <span className="mono-text">${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-line-item">
              <span>IoT Cold-Chain Telemetry</span>
              <span className="text-emerald font-semibold">Included (0.00)</span>
            </div>

            <div className="summary-line-item">
              <span>Smart Contract Gas Escrow</span>
              <span className="text-cyan font-semibold">Subsidized (0.00)</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total-row">
              <span className="total-label">Total Escrow Value</span>
              <span className="total-amount mono-text">${totalAmount.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary btn-lg checkout-action-btn"
              onClick={() => navigate('/checkout')}
            >
              <span>Proceed to Secure Checkout</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>

            {/* Security Guarantee Box */}
            <div className="cart-security-badge-box">
              <div className="security-item">
                <FontAwesomeIcon icon={faShieldHalved} className="text-emerald" />
                <span>Smart Contract Automated Custody Handover</span>
              </div>
              <div className="security-item">
                <FontAwesomeIcon icon={faLock} className="text-cyan" />
                <span>Encrypted Multi-Sig Release Protocol</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
