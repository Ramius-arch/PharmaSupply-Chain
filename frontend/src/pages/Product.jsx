import React, { useState, useEffect } from 'react';
import productService from '../api/productService';
import ProductCard from '../components/ProductCard/ProductCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import EmptyState from '../components/UI/EmptyState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faPills,
  faSortAmountDown,
  faCube,
  faRotateRight,
  faBorderAll,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import './Product.css';

const categories = [
  'All Medicines',
  'Antibiotics',
  'Vaccines',
  'Biologics',
  'Cardiovascular',
  'Pain Relief',
  'Oncology',
];

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Medicines');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'compact'

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAllProducts();
      setProducts(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      setError('Failed to query verified drug records from network node.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.manufacturer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'All Medicines' ||
      (product.category || '').toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const priceA = a.unitPrice ?? a.price ?? 0;
    const priceB = b.unitPrice ?? b.price ?? 0;

    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'name-az') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'stock') return (b.quantityInStock || 0) - (a.quantityInStock || 0);
    return 0;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Medicines');
    setSortBy('default');
  };

  return (
    <div className="products-catalog-page container animate-fade-in">
      {/* Page Header */}
      <div className="catalog-hero-header">
        <div className="catalog-title-block">
          <span className="section-eyebrow">Decentralized Inventory</span>
          <h1 className="catalog-headline">Verified Medicine Registry</h1>
          <p className="catalog-subheadline">
            Explore authentic pharmaceutical formulations tracked from manufacturer batch creation to smart contract delivery.
          </p>
        </div>

        {/* Global Catalog Stats */}
        <div className="catalog-meta-pills">
          <div className="meta-pill">
            <span className="meta-pill-val">{products.length}</span>
            <span className="meta-pill-lbl">Active Lots</span>
          </div>
          <div className="meta-pill">
            <span className="meta-pill-val text-emerald">100%</span>
            <span className="meta-pill-lbl">Provenance OK</span>
          </div>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="catalog-controls-card card">
        {/* Top Controls Row */}
        <div className="controls-top-row">
          {/* Search Box */}
          <div className="catalog-search-wrap">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              className="catalog-search-input"
              placeholder="Search by drug name, chemical compound, or manufacturer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                &times;
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="catalog-sort-wrap">
            <FontAwesomeIcon icon={faSortAmountDown} className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="catalog-select"
            >
              <option value="default">Sort: Default Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
              <option value="stock">Stock Availability</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="category-pills-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Bar */}
      <div className="results-summary-bar">
        <div className="results-count-text">
          Showing <strong>{filteredProducts.length}</strong> verified medicine(s)
          {selectedCategory !== 'All Medicines' && (
            <span className="active-filter-badge"> in {selectedCategory}</span>
          )}
        </div>

        {(searchQuery || selectedCategory !== 'All Medicines' || sortBy !== 'default') && (
          <button onClick={handleResetFilters} className="reset-filters-btn">
            <FontAwesomeIcon icon={faRotateRight} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Grid or Loading/Empty states */}
      {loading ? (
        <LoadingSpinner message="Scanning decentralized medicine catalog..." />
      ) : error ? (
        <EmptyState
          icon={faCube}
          title="Network Node Error"
          description={error}
          action={
            <button onClick={fetchProducts} className="btn btn-outline">
              <FontAwesomeIcon icon={faRotateRight} /> Retry Sync
            </button>
          }
        />
      ) : filteredProducts.length === 0 ? (
        <div className="card catalog-empty-card">
          <div className="empty-icon-wrap">
            <FontAwesomeIcon icon={faPills} />
          </div>
          <h3>No matching pharmaceuticals found</h3>
          <p>Try searching for a different drug name, manufacturer, or clear the category filters.</p>
          <button onClick={handleResetFilters} className="btn btn-primary">
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="catalog-products-grid stagger-children">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={{
                id: product._id || product.id,
                name: product.name,
                unitPrice: product.unitPrice ?? product.price ?? 0,
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
  );
}

export default Products;