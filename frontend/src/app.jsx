import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Sidebar from './components/Layout/Sidebar.jsx';
import ProtectedRoute from './components/Layout/ProtectedRoute.jsx';
import Breadcrumbs from './components/Layout/Breadcrumbs.jsx';
import ScrollToTop from './components/Layout/ScrollToTop.jsx';
import PageSkeleton from './components/Layout/PageSkeleton.jsx';
import ChatBot from './components/ChatBot/ChatBot.jsx';

// Lazy loaded pages/components
const Home = lazy(() => import('./components/Home/Home.jsx'));
const Login = lazy(() => import('./components/Login/Login.jsx'));
const Register = lazy(() => import('./components/Register/Register.jsx'));
const Products = lazy(() => import('./pages/Product.jsx'));
const ProductDetails = lazy(() => import('./components/ProductDetails/ProductDetails.jsx'));
const Cart = lazy(() => import('./components/Cart/Cart.jsx'));
const Checkout = lazy(() => import('./components/Checkout/Checkout.jsx'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard/AdminDashboard.jsx'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard.jsx'));
const MyOrders = lazy(() => import('./pages/MyOrders.jsx'));
const GenerateWallet = lazy(() => import('./components/GenerateWallet/GenerateWallet.jsx'));
const TransactionHistory = lazy(() => import('./components/Blockchain/TransactionHistory.jsx'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword/ForgotPassword.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Styles
import './App.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Router>
      <ScrollToTop />
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
                <Suspense fallback={<PageSkeleton />}>
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

                    {/* 404 Catch-all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
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