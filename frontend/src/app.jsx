import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Sidebar from './components/Layout/Sidebar.jsx';
import ProtectedRoute from './components/Layout/ProtectedRoute.jsx';
import Home from './components/Home/Home.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Products from './pages/Product.jsx';
import ProductDetails from './components/ProductDetails/ProductDetails.jsx';
import Cart from './components/Cart/Cart.jsx';
import Checkout from './components/Checkout/Checkout.jsx';
import AdminDashboard from './components/AdminDashboard/AdminDashboard.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import MyOrders from './pages/MyOrders.jsx';
import GenerateWallet from './components/GenerateWallet/GenerateWallet.jsx';
import TransactionHistory from './components/Blockchain/TransactionHistory.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';
import ChatBot from './components/ChatBot/ChatBot.jsx';

import Breadcrumbs from './components/Layout/Breadcrumbs.jsx';

// Styles
import './App.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app-container">
            <header className="mobile-only-header">
              <button className="menu-toggle" onClick={toggleSidebar}>
                {sidebarOpen ? '✕' : '☰'}
              </button>
              <h1 className="logo">PharmaNet</h1>
              <div style={{ width: '40px' }}></div> {/* Spacer */}
            </header>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
              <Breadcrumbs />
              <main className="content-wrap">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />

                  {/* Protected routes — authenticated users only */}
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                  <Route path="/generate-wallet" element={<ProtectedRoute><GenerateWallet /></ProtectedRoute>} />
                  <Route path="/blockchain-transaction" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />

                  {/* Admin/Supplier routes — role-restricted */}
                  <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'supplier']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'supplier']}><Dashboard /></ProtectedRoute>} />
                </Routes>
              </main>
              <ToastContainer />
              <ChatBot />
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;