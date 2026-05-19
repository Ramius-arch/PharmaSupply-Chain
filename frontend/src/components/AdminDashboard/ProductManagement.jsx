import React, { useState, useEffect, useContext } from 'react';
import './AdminDashboard.css';
import productService from '../../api/productService';
import blockchainService from '../../api/blockchainService';
import { AuthContext } from '../../context/AuthContext';

const ProductManagement = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    unitPrice: '',
    category: '',
    manufacturer: '',
    quantityInStock: '',
    dosageForm: '',
    strength: '',
    pharmaceuticalCode: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getAllProducts();
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Create blockchain item
      const blockchainResponse = await blockchainService.createBlockchainItem(newProduct.description, token);
      const blockchainItemId = blockchainResponse.data.itemId;

      // 2. Create product with blockchainItemId
      const productToCreate = { ...newProduct, blockchainItemId };
      const productResponse = await productService.createProduct(productToCreate, token);

      // 3. Update products list
      setProducts([...products, productResponse.data]);
      setNewProduct({
        name: '',
        description: '',
        unitPrice: '',
        category: '',
        manufacturer: '',
        quantityInStock: '',
        dosageForm: '',
        strength: '',
        pharmaceuticalCode: '',
      });
    } catch (err) {
      setError('Failed to create product.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-management">
      <div className="admin-header">
        <h2>Product Inventory Management</h2>
      </div>

      <form onSubmit={handleFormSubmit} className="admin-form grid-2">
        <div className="input-group full-width">
          <label>Product Name</label>
          <input name="name" value={newProduct.name} onChange={handleInputChange} placeholder="E.g. Paracetamol 500mg" required />
        </div>
        <div className="input-group full-width">
          <label>Description</label>
          <textarea name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Detailed product specifications..." required />
        </div>
        <div className="input-group">
          <label>Unit Price ($)</label>
          <input name="unitPrice" value={newProduct.unitPrice} onChange={handleInputChange} type="number" step="0.01" required />
        </div>
        <div className="input-group">
          <label>Initial Stock</label>
          <input name="quantityInStock" value={newProduct.quantityInStock} onChange={handleInputChange} type="number" required />
        </div>
        <div className="input-group">
          <label>Category</label>
          <input name="category" value={newProduct.category} onChange={handleInputChange} placeholder="E.g. Antibiotics" required />
        </div>
        <div className="input-group">
          <label>Manufacturer</label>
          <input name="manufacturer" value={newProduct.manufacturer} onChange={handleInputChange} required />
        </div>
        <div className="input-group">
          <label>Strength</label>
          <input name="strength" value={newProduct.strength} onChange={handleInputChange} placeholder="E.g. 500mg" />
        </div>
        <div className="input-group">
          <label>Dosage Form</label>
          <input name="dosageForm" value={newProduct.dosageForm} onChange={handleInputChange} placeholder="E.g. Tablet" />
        </div>
        <div className="input-group full-width">
          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px' }} disabled={loading}>
            {loading ? 'Processing Blockchain Record...' : 'Register New Pharmaceutical Product'}
          </button>
        </div>
        {error && <p className="error-message" style={{ color: 'var(--danger)', marginTop: '12px' }}>{error}</p>}
      </form>

      <div className="admin-table-container">
        <h3>Active Inventory</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Product Name</th>
              <th>Unit Price</th>
              <th>Stock</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{product._id.slice(-8)}</td>
                <td style={{ fontWeight: '600' }}>{product.name}</td>
                <td>${product.unitPrice.toFixed(2)}</td>
                <td>
                  <span className={`status-chip ${product.quantityInStock > 10 ? 'success' : 'warning'}`}>
                    {product.quantityInStock} units
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', marginRight: '8px' }}>Edit</button>
                  <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
