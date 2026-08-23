import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faPills,
  faShieldHalved,
  faShoppingCart,
  faCheck,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../../context/CartContext';
import { getProductImage } from '../../utils/productUtils';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const priceValue = product.unitPrice !== undefined 
    ? product.unitPrice 
    : (product.price > 100 ? product.price / 100 : product.price) || 0;

  const imgUrl = getProductImage(product);
  const stock = product.quantityInStock !== undefined ? product.quantityInStock : 45;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id || product._id,
      name: product.name,
      unitPrice: priceValue,
      price: priceValue,
      image: imgUrl,
      category: product.category,
      manufacturer: product.manufacturer,
      quantityInStock: stock,
    }, 1);

    setAdded(true);
    toast.success(`Added ${product.name} to shipment cart!`);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="modern-product-card card-interactive animate-scale-in">
      {/* Image & Badges */}
      <Link to={`/products/${product.id || product._id}`} className="product-media-wrap" aria-label={`View details for ${product.name}`}>
        <img src={imgUrl} alt={product.name} className="product-card-img" loading="lazy" />
        <div className="product-overlay-glow" />
        
        <div className="product-card-tags">
          {product.category && (
            <span className="product-badge-category">{product.category}</span>
          )}
          <span className="product-badge-verified">
            <FontAwesomeIcon icon={faShieldHalved} />
            Verified
          </span>
        </div>
      </Link>

      {/* Content Info */}
      <div className="product-card-body">
        {product.manufacturer && (
          <div className="product-mfg-row">
            <FontAwesomeIcon icon={faBuilding} className="mfg-icon" />
            <span className="mfg-name">{product.manufacturer}</span>
          </div>
        )}

        <h3 className="product-title">
          <Link to={`/products/${product.id || product._id}`}>{product.name}</Link>
        </h3>

        {/* Stock Meter */}
        <div className="stock-meter-container">
          <div className="stock-meter-header">
            <span className="stock-label">Ledger Stock</span>
            <span className={`stock-count ${stock > 10 ? 'in-stock' : 'low-stock'}`}>
              {stock > 0 ? `${stock} units` : 'Out of stock'}
            </span>
          </div>
          <div className="stock-progress-track">
            <div 
              className={`stock-progress-fill ${stock > 10 ? 'fill-emerald' : 'fill-amber'}`}
              style={{ width: `${Math.min(100, Math.max(8, (stock / 100) * 100))}%` }}
            />
          </div>
        </div>

        {/* Price & Actions */}
        <div className="product-card-footer">
          <div className="product-price-box">
            <span className="price-currency">$</span>
            <span className="price-amount">{priceValue.toFixed(2)}</span>
          </div>

          <div className="product-actions-cluster">
            <button
              onClick={handleQuickAdd}
              className={`btn ${added ? 'btn-emerald' : 'btn-outline-primary'} btn-sm quick-add-btn`}
              title="Quick Add to Shipment Cart"
              disabled={stock <= 0}
            >
              <FontAwesomeIcon icon={added ? faCheck : faShoppingCart} />
              <span>{added ? 'Added' : 'Add'}</span>
            </button>

            <Link 
              to={`/products/${product.id || product._id}`} 
              className="btn btn-outline btn-sm view-trace-btn"
              title="View on-chain provenance"
            >
              <span>Trace</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
