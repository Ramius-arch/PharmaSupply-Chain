import React, { useState, useEffect, useContext, useCallback } from 'react';
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

const DEFAULT_DEMO_SHIPMENTS = [
  {
    _id: 'DEMO-ORD-882194',
    orderNumber: 'ORD-882194',
    orderDate: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'In Transit',
    totalAmount: 12500,
    items: [
      { product: 'amoxicillin', name: 'Amoxicillin Trihydrate 500mg (100x)', quantity: 20, price: 250 },
      { product: 'atorvastatin', name: 'Atorvastatin Calcium 20mg (500x)', quantity: 15, price: 500 },
    ],
    shippingAddress: 'St. Jude Children’s Research Hospital, Node #04, Memphis, TN 38105',
    paymentMethod: 'Sepolia Web3 Escrow',
    transactionHash: '0x7b43f9a2e88102c91bdf8018318e80112948cbbfa81920aa9128301828108420',
    blockNumber: 1984214,
    temperatureStatus: '4.1°C (Optimal Range)',
  },
  {
    _id: 'DEMO-ORD-882190',
    orderNumber: 'ORD-882190',
    orderDate: new Date(Date.now() - 3600000 * 28).toISOString(),
    status: 'Delivered',
    totalAmount: 38400,
    items: [
      { product: 'vaccine', name: 'Spikevax mRNA Bivalent 0.5mL (Cryo-Pack 50x)', quantity: 40, price: 960 },
    ],
    shippingAddress: 'Charité University Hospital, Central Pharmacy, Berlin, Germany',
    paymentMethod: 'Institutional Smart Contract',
    transactionHash: '0x1849a029381cbb49018401928374901238491028394019283019283019283019',
    blockNumber: 1984180,
    temperatureStatus: '-78.2°C (Cryogenic Integrity Verified)',
  },
  {
    _id: 'DEMO-ORD-882185',
    orderNumber: 'ORD-882185',
    orderDate: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: 'Delivered',
    totalAmount: 18200,
    items: [
      { product: 'insulin', name: 'Human Insulin Isophane 100 IU/mL (10x Vials)', quantity: 50, price: 364 },
    ],
    shippingAddress: 'Mayo Clinic Supply Station, Rochester, MN 55905',
    paymentMethod: 'Sepolia Web3 Escrow',
    transactionHash: '0x9481028301928301928301928301928301928301928301928301928301928301',
    blockNumber: 1984152,
    temperatureStatus: '3.8°C (Optimal Range)',
  },
];

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let apiOrders = [];
      if (token && !user?.isGuestDemo) {
        const res = await orderService.getMyOrders(token);
        apiOrders = Array.isArray(res) ? res : res.data || [];
      }
      
      const sessionDemo = JSON.parse(sessionStorage.getItem('demo_orders') || '[]');
      if (apiOrders.length > 0) {
        setOrders([...sessionDemo, ...apiOrders]);
      } else {
        setOrders([...sessionDemo, ...DEFAULT_DEMO_SHIPMENTS]);
      }
    } catch (err) {
      console.warn('Retrieving demo shipments:', err);
      const sessionDemo = JSON.parse(sessionStorage.getItem('demo_orders') || '[]');
      setOrders([...sessionDemo, ...DEFAULT_DEMO_SHIPMENTS]);
    } finally {
      setLoading(false);
    }
  }, [token, user?.isGuestDemo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
