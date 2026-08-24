import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AmbienceProvider } from './context/AmbienceContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Sidebar from './components/Layout/Sidebar.jsx';
import Header from './components/Layout/Header.jsx';
import Footer from './components/Layout/Footer.jsx';
import AmbientBackdrop from './components/Layout/AmbientBackdrop.jsx';
import ProtectedRoute from './components/Layout/ProtectedRoute.jsx';
import Home from './components/Home/Home.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Products from './pages/Product.jsx';
import ProductDetails from './components/ProductDetails/ProductDetails.jsx';
import Cart from './components/Cart/Cart.jsx';
import Checkout from './components/Checkout/Checkout.jsx';
import CheckoutSuccess from './components/Checkout/CheckoutSuccess.jsx';
import AdminDashboard from './components/AdminDashboard/AdminDashboard.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import MyOrders from './pages/MyOrders.jsx';
import GenerateWallet from './components/GenerateWallet/GenerateWallet.jsx';
import TransactionHistory from './components/Blockchain/TransactionHistory.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';
import ImmersiveBackdropTest from './pages/ImmersiveBackdropTest.jsx';

import Breadcrumbs from './components/Layout/Breadcrumbs.jsx';
import SmoothScroll from './components/UI/SmoothScroll.jsx';

// Styles
import './App.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = sessionStorage.getItem('pharma_sidebar_collapsed');
    return saved !== null ? saved === 'true' : true; // Default: collapsed (true)
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      sessionStorage.setItem('pharma_sidebar_collapsed', next.toString());
      return next;
    });
  };

  // Emil Kowalski shortcut: Cmd+B / Ctrl+B toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebarCollapsed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <SmoothScroll>
        <AmbienceProvider>
          <AuthProvider>
            <CartProvider>
              <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <AmbientBackdrop />
                <Sidebar 
                  isOpen={sidebarOpen} 
                  isCollapsed={sidebarCollapsed}
                  onToggleCollapse={toggleSidebarCollapsed}
                  onClose={closeSidebar} 
                />

            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}

            <div className="main-content">
              <Header onToggleSidebar={toggleSidebar} isSidebarCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebarCollapsed} />

              <div className="desktop-breadcrumb-wrap">
                <Breadcrumbs />
              </div>

              <main className="content-wrap" onClick={closeSidebar}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/test-backdrop" element={<ImmersiveBackdropTest />} />

                  {/* Protected routes — authenticated users only */}
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/checkout/success" element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />
                  <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                  <Route path="/generate-wallet" element={<ProtectedRoute><GenerateWallet /></ProtectedRoute>} />
                  <Route path="/blockchain-transaction" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />

                  {/* Admin/Supplier routes — role-restricted */}
                  <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'supplier']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'supplier']}><Dashboard /></ProtectedRoute>} />
                </Routes>
              </main>

              <Footer />
              <ToastContainer 
                theme="dark"
                position="bottom-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
              />
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </AmbienceProvider>
  </SmoothScroll>
</Router>
  );
};
export default App;