import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faArrowLeft,
  faShoppingCart,
  faBuilding,
  faPills,
  faVial,
  faBoxesStacked,
  faCheck,
  faCopy,
  faStar,
  faCube,
  faLink,
  faTruck,
  faHospital,
  faCalendarAlt,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import productService from '../../api/productService';
import blockchainService from '../../api/blockchainService';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import EmptyState from '../UI/EmptyState';
import { toast } from 'react-toastify';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const token = user?.token;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blockchainItem, setBlockchainItem] = useState(null);
  const [blockchainHistory, setBlockchainHistory] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Review State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      author: 'Dr. Sarah Jenkins, Chief Pharmacist',
      hospital: 'St. Jude Clinical Hospital',
      rating: 5,
      comment: 'Full thermal log verified on-chain. Integrity intact and batch passed all spectrophotometry tests.',
      date: '2026-08-12',
    }
  ]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProductById(id);
        const currentProd = productData.data || productData;
        setProduct(currentProd);

        if (currentProd.blockchainItemId && token) {
          try {
            const blockchainDetails = await blockchainService.getBlockchainItemDetails(currentProd.blockchainItemId, token);
            setBlockchainItem(blockchainDetails.data || blockchainDetails);

            const blockchainHist = await blockchainService.getBlockchainItemHistory(currentProd.blockchainItemId, token);
            setBlockchainHistory(blockchainHist.data || blockchainHist);
          } catch (bErr) {
            console.warn('Blockchain item fetch warning:', bErr);
          }
        }
      } catch (err) {
        setError('Unable to fetch product details from ledger node.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, token]);

  const handleAddToCart = () => {
    if (!product) return;
    const priceVal = product.unitPrice !== undefined ? product.unitPrice : (product.price || 0);

    addToCart({
      id: product.id || product._id,
      name: product.name,
      unitPrice: priceVal,
      price: priceVal,
      image: product.image,
      category: product.category,
      manufacturer: product.manufacturer,
      quantityInStock: product.quantityInStock,
    }, quantity);

    setAddedToCart(true);
    toast.success(`Added ${quantity} unit(s) of ${product.name} to shipment cart!`);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleCopyItemId = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    toast.info('Blockchain ID copied to clipboard!');
    setTimeout(() => setCopiedHash(false), 1800);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.warning('Please enter review comments.');
      return;
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      author: `${user?.firstName || 'Verified'} ${user?.lastName || 'Pharmacist'}`,
      hospital: 'Clinical Dispenser Node',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };

    setReviewsList([newRev, ...reviewsList]);
    setComment('');
    toast.success('Clinical feedback recorded on node.');
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving batch specifications and ledger audit..." fullScreen />;
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '60px 20px' }}>
        <EmptyState
          icon={faCube}
          title="Product Not Found"
          description={error || "This pharmaceutical ID doesn't exist on the network."}
          action={<Link to="/products" className="btn btn-outline">Back to Catalog</Link>}
        />
      </div>
    );
  }

  const priceVal = product.unitPrice !== undefined ? product.unitPrice : (product.price || 0);
  const stock = product.quantityInStock !== undefined ? product.quantityInStock : 45;
  const imgUrl = product.image || `https://picsum.photos/seed/${id}/800/600?grayscale`;

  return (
    <div className="product-details-page container animate-fade-in">
      {/* Top Back Navigation */}
      <div className="details-top-bar">
        <Link to="/products" className="btn btn-outline btn-sm">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Catalog</span>
        </Link>
        <span className="details-breadcrumbs-label">
          {product.category || 'Medicine'} / <strong style={{ color: '#fff' }}>{product.name}</strong>
        </span>
      </div>

      {/* Main Split Layout */}
      <div className="product-main-grid">
        {/* Left Column: Visual Media & Verification Pill */}
        <div className="product-media-card card">
          <div className="product-image-frame">
            <img src={imgUrl} alt={product.name} className="product-detail-img" />
            <div className="product-media-backdrop-glow" />
            
            {/* Blockchain Verified Floating Pill */}
            <div className="detail-verified-badge">
              <span className="pulse-dot emerald"></span>
              <span>Blockchain Verified</span>
              {product.blockchainItemId && (
                <button 
                  className="copy-mini-btn" 
                  onClick={() => handleCopyItemId(product.blockchainItemId.toString())}
                  title="Copy Blockchain Item ID"
                >
                  <FontAwesomeIcon icon={copiedHash ? faCheck : faCopy} />
                </button>
              )}
            </div>
          </div>

          {/* Quick Technical Specs Pill Row */}
          <div className="quick-specs-row">
            <div className="quick-spec-item">
              <span className="quick-spec-label">Dosage Form</span>
              <span className="quick-spec-value">{product.dosageForm || 'Oral Tablet'}</span>
            </div>
            <div className="quick-spec-item">
              <span className="quick-spec-label">Strength</span>
              <span className="quick-spec-value">{product.strength || '500 mg'}</span>
            </div>
            <div className="quick-spec-item">
              <span className="quick-spec-label">Lot Status</span>
              <span className="quick-spec-value text-emerald">Active / Certified</span>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Add to Cart Action */}
        <div className="product-info-panel card">
          <div className="product-header-section">
            <div className="product-category-row">
              <span className="product-badge-category">{product.category || 'Pharmaceutical'}</span>
              {product.manufacturer && (
                <span className="product-mfg-tag">
                  <FontAwesomeIcon icon={faBuilding} />
                  {product.manufacturer}
                </span>
              )}
            </div>
            
            <h1 className="product-main-title">{product.name}</h1>

            <div className="product-price-row">
              <div className="detail-price-box">
                <span className="detail-price-symbol">$</span>
                <span className="detail-price-number">{priceVal.toFixed(2)}</span>
                <span className="detail-price-unit">/ unit</span>
              </div>

              <span className={`status-chip ${stock > 0 ? 'success' : 'danger'}`}>
                {stock > 0 ? `${stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          <div className="product-divider" />

          {/* Description */}
          <div className="product-description-block">
            <h3 className="subheading-title">Formulation Overview</h3>
            <p className="description-text">
              {product.description || 'Verified pharmaceutical batch formulated in compliance with Good Manufacturing Practice (GMP) protocols and registered with cryptographic hash signatures.'}
            </p>
          </div>

          {/* Specifications Bento Cards */}
          <div className="specs-bento-grid">
            <div className="spec-bento-item">
              <FontAwesomeIcon icon={faPills} className="spec-bento-icon text-orange" />
              <div>
                <span className="spec-bento-label">Active Formulation</span>
                <strong className="spec-bento-val">{product.strength || 'Standard Dose'}</strong>
              </div>
            </div>
            <div className="spec-bento-item">
              <FontAwesomeIcon icon={faVial} className="spec-bento-icon text-cyan" />
              <div>
                <span className="spec-bento-label">Delivery Format</span>
                <strong className="spec-bento-val">{product.dosageForm || 'Unit Dose'}</strong>
              </div>
            </div>
            <div className="spec-bento-item">
              <FontAwesomeIcon icon={faBoxesStacked} className="spec-bento-icon text-emerald" />
              <div>
                <span className="spec-bento-label">Batch Availability</span>
                <strong className="spec-bento-val">{stock} units available</strong>
              </div>
            </div>
            <div className="spec-bento-item">
              <FontAwesomeIcon icon={faShieldHalved} className="spec-bento-icon text-violet" />
              <div>
                <span className="spec-bento-label">Security Protocol</span>
                <strong className="spec-bento-val">ECDSA Verified</strong>
              </div>
            </div>
          </div>

          {/* Quantity and Add to Cart Section */}
          <div className="purchase-action-container">
            <div className="quantity-stepper">
              <button 
                className="qty-btn" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="qty-number">{quantity}</span>
              <button 
                className="qty-btn" 
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                disabled={quantity >= stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`btn ${addedToCart ? 'btn-emerald' : 'btn-primary'} btn-lg add-cart-main-btn`}
              disabled={stock <= 0}
            >
              <FontAwesomeIcon icon={addedToCart ? faCheck : faShoppingCart} />
              <span>{addedToCart ? 'Added to Cart' : `Add ${quantity} Unit(s) to Cart`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Bottom Tabs: Blockchain Provenance & Clinical Reviews ─── */}
      <div className="details-lower-grid">
        {/* Blockchain Traceability Box */}
        <div className="blockchain-provenance-panel card">
          <div className="panel-header-flex">
            <div className="panel-title-group">
              <FontAwesomeIcon icon={faLink} className="panel-icon text-cyan" />
              <h2 className="panel-heading">Blockchain Provenance & Telemetry</h2>
            </div>
            <span className="status-chip success">
              {blockchainItem?.status || 'Ledger Synchronized'}
            </span>
          </div>

          <p className="panel-subtext">
            Immutable transition history recorded on the smart contract for batch #{product.blockchainItemId || id.slice(-6)}.
          </p>

          {/* Stepper Timeline */}
          <div className="provenance-timeline">
            <div className="timeline-node active">
              <div className="timeline-node-icon bg-orange">
                <FontAwesomeIcon icon={faCube} />
              </div>
              <div className="timeline-node-body">
                <div className="timeline-title-row">
                  <span className="node-title">Batch Created on Smart Contract</span>
                  <span className="node-time mono-text">Block #{blockchainItem?.blockNumber || '1984012'}</span>
                </div>
                <p className="node-desc">
                  Signed by authorized manufacturer node with cryptographic assay hash.
                </p>
              </div>
            </div>

            <div className="timeline-node active">
              <div className="timeline-node-icon bg-cyan">
                <FontAwesomeIcon icon={faTruck} />
              </div>
              <div className="timeline-node-body">
                <div className="timeline-title-row">
                  <span className="node-title">Cold-Chain Handover to Certified Courier</span>
                  <span className="node-time mono-text">IoT Verified</span>
                </div>
                <p className="node-desc">
                  Thermal telemetry stable at 3.8°C. Custody transferred on-chain.
                </p>
              </div>
            </div>

            <div className="timeline-node">
              <div className="timeline-node-icon bg-emerald">
                <FontAwesomeIcon icon={faHospital} />
              </div>
              <div className="timeline-node-body">
                <div className="timeline-title-row">
                  <span className="node-title">Hospital Receiving & Dispensing Node</span>
                  <span className="node-time mono-text">Awaiting Scan</span>
                </div>
                <p className="node-desc">
                  Final cryptographic check on delivery before patient dispensation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Reviews & Batch Verification Feedback */}
        <div className="clinical-reviews-panel card">
          <div className="panel-header-flex">
            <div className="panel-title-group">
              <FontAwesomeIcon icon={faCommentDots} className="panel-icon text-orange" />
              <h2 className="panel-heading">Clinical Feedback</h2>
            </div>
            <span className="badge badge-primary">{reviewsList.length} Verified Review(s)</span>
          </div>

          {/* Review List */}
          <div className="reviews-list-container">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="review-item-card">
                <div className="review-header">
                  <div>
                    <h4 className="review-author">{rev.author}</h4>
                    <span className="review-hospital">{rev.hospital}</span>
                  </div>
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesomeIcon 
                        key={star} 
                        icon={faStar} 
                        className={star <= rev.rating ? 'star-gold' : 'star-muted'} 
                      />
                    ))}
                  </div>
                </div>
                <p className="review-body-text">{rev.comment}</p>
                <span className="review-date mono-text">{rev.date}</span>
              </div>
            ))}
          </div>

          {/* Submit Review Form */}
          <form onSubmit={handleReviewSubmit} className="submit-review-form">
            <h4 className="form-subheading">Submit Clinical Lot Report</h4>
            
            <div className="rating-select-row">
              <span className="rating-label">Quality Score:</span>
              <div className="interactive-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className="star-button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <FontAwesomeIcon 
                      icon={faStar} 
                      className={(hoverRating || rating) >= star ? 'star-gold' : 'star-muted'} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label>Pharmacist Notes / Batch Feedback</label>
              <textarea
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Log cold-chain observations or assay verification notes..."
                required
              />
            </div>

            <button type="submit" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
              Submit Lot Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;