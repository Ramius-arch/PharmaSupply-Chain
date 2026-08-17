import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen,
  faTruckFast,
  faCheckCircle,
  faClock,
  faLink,
  faArrowRight,
  faPills,
  faReceipt,
  faCopy,
  faCheck,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import orderService from '../api/orderService';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import EmptyState from '../components/UI/EmptyState';
import { toast } from 'react-toastify';
import './MyOrders.css';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getMyOrders(token);
      setOrders(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      setError('Unable to retrieve shipment history from network node.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleCopyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.info('Shipment Manifest ID copied!');
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'all') return true;
    return (order.status || '').toLowerCase() === filterStatus;
  });

  const getStepIndex = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
      case 'intransit':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="my-orders-page container animate-fade-in">
      {/* Header */}
      <div className="orders-hero-header">
        <div>
          <span className="section-eyebrow">Supply Chain Tracking</span>
          <h1 className="orders-headline">My Shipment Manifests</h1>
          <p className="orders-subheadline">
            Monitor real-time status transitions and smart contract receipts for your pharmaceutical orders.
          </p>
        </div>

        {/* Global Orders Stats */}
        <div className="orders-meta-badges">
          <div className="meta-badge-box">
            <span className="meta-val">{orders.length}</span>
            <span className="meta-lbl">Total Shipments</span>
          </div>
          <div className="meta-badge-box">
            <span className="meta-val text-cyan">
              {orders.filter(o => o.status === 'shipped' || o.status === 'processing').length}
            </span>
            <span className="meta-lbl">In Transit</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="orders-filter-bar card">
        <div className="filter-pill-cluster">
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              className={`order-filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <button onClick={fetchOrders} className="refresh-orders-btn" title="Refresh Order History">
          <FontAwesomeIcon icon={faRotateRight} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <LoadingSpinner message="Querying verified orders from node database..." />
      ) : error ? (
        <EmptyState
          icon={faBoxOpen}
          title="Network Connection Issue"
          description={error}
          action={
            <button onClick={fetchOrders} className="btn btn-outline">
              Retry Sync
            </button>
          }
        />
      ) : filteredOrders.length === 0 ? (
        <div className="card empty-orders-card">
          <div className="empty-orders-icon">
            <FontAwesomeIcon icon={faBoxOpen} />
          </div>
          <h3>No Shipments Found</h3>
          <p>You haven't placed any pharmaceutical orders with this filter state yet.</p>
          <Link to="/products" className="btn btn-primary">
            <span>Browse Medicine Catalog</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      ) : (
        <div className="orders-list-grid stagger-children">
          {filteredOrders.map((order) => {
            const step = getStepIndex(order.status);
            const orderIdShort = (order._id || '').slice(-8).toUpperCase();
            const total = order.totalAmount !== undefined 
              ? (order.totalAmount > 100 ? order.totalAmount / 100 : order.totalAmount) 
              : 0;

            return (
              <div key={order._id} className="order-item-card card">
                {/* Order Top Summary */}
                <div className="order-card-header">
                  <div className="order-id-group">
                    <span className="order-hash-id mono-text">#{orderIdShort}</span>
                    <button
                      onClick={() => handleCopyOrderId(order._id)}
                      className="copy-order-btn"
                      title="Copy Full Order ID"
                    >
                      <FontAwesomeIcon icon={copiedId === order._id ? faCheck : faCopy} />
                    </button>
                    <span className="order-date-pill">
                      {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="order-status-badge-wrap">
                    <span className={`status-chip ${order.status}`}>
                      {order.status || 'Verified'}
                    </span>
                    <div className="order-amount-display">
                      ${total.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Visual Step Progress Tracker */}
                <div className="shipment-progress-tracker">
                  <div className={`progress-step ${step >= 1 ? 'completed' : ''}`}>
                    <div className="step-circle">
                      <FontAwesomeIcon icon={faReceipt} />
                    </div>
                    <span className="step-label">Order Verified</span>
                  </div>

                  <div className={`progress-line ${step >= 2 ? 'active' : ''}`} />

                  <div className={`progress-step ${step >= 2 ? 'completed' : ''}`}>
                    <div className="step-circle">
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                    <span className="step-label">Lab Pack</span>
                  </div>

                  <div className={`progress-line ${step >= 3 ? 'active' : ''}`} />

                  <div className={`progress-step ${step >= 3 ? 'completed' : ''}`}>
                    <div className="step-circle">
                      <FontAwesomeIcon icon={faTruckFast} />
                    </div>
                    <span className="step-label">In-Transit</span>
                  </div>

                  <div className={`progress-line ${step >= 4 ? 'active' : ''}`} />

                  <div className={`progress-step ${step >= 4 ? 'completed' : ''}`}>
                    <div className="step-circle">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <span className="step-label">Delivered</span>
                  </div>
                </div>

                {/* Items Manifest Accordion Box */}
                <div className="order-items-manifest">
                  <h4 className="manifest-title">Shipment Manifest ({order.items?.length || 0} item types)</h4>
                  <div className="manifest-list">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="manifest-item-row">
                        <div className="manifest-item-icon">
                          <FontAwesomeIcon icon={faPills} />
                        </div>
                        <div className="manifest-item-info">
                          <span className="manifest-item-name">
                            {item.product?.name || item.name || 'Pharmaceutical Batch'}
                          </span>
                          <span className="manifest-item-qty">
                            Qty: <strong>{item.quantity || 1} units</strong>
                          </span>
                        </div>
                        <div className="manifest-item-price mono-text">
                          ${(((item.price || item.unitPrice || 0) / (item.price > 100 ? 100 : 1)) * (item.quantity || 1)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Destination & Blockchain Footer */}
                <div className="order-card-footer">
                  <div className="order-destination">
                    <span className="dest-label">Destination Node:</span>
                    <span className="dest-value">{order.shippingAddress || 'Clinical Facility Hub'}</span>
                  </div>

                  <div className="order-card-actions">
                    <Link to="/blockchain-transaction" className="btn btn-outline btn-sm">
                      <FontAwesomeIcon icon={faLink} />
                      <span>Ledger Audit</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
