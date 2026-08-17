import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DashboardOverview from './DashboardOverview';
import ProductManagement from './ProductManagement';
import AdminOrders from './AdminOrders';
import UserManagement from './UserManagement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faBoxesStacked,
  faTruckFast,
  faUsers,
  faShieldHalved,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');

  const totalOrders = 1248;
  const revenue = 842900;
  const usersCount = 42;

  return (
    <div className="admin-dashboard container animate-fade-in">
      {/* Header */}
      <div className="admin-header-row">
        <div>
          <div className="admin-badge-pill">
            <FontAwesomeIcon icon={faShieldHalved} />
            <span>Root Authority Node</span>
          </div>
          <h1 className="admin-headline">Platform Control Center</h1>
          <p className="admin-subheadline">
            Manage pharmaceutical inventory minting, shipment status transitions, and stakeholder privileges.
          </p>
        </div>

        <div className="admin-node-info-pill">
          <span className="pulse-dot emerald"></span>
          <span className="node-label">EVM Station Active:</span>
          <strong className="mono-text text-cyan">{user?.firstName || 'Admin'} Node</strong>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="admin-tabs-bar card">
        <button
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FontAwesomeIcon icon={faChartPie} />
          <span>System Overview</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <FontAwesomeIcon icon={faBoxesStacked} />
          <span>Medicine Inventory</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FontAwesomeIcon icon={faTruckFast} />
          <span>Shipment Logistics</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FontAwesomeIcon icon={faUsers} />
          <span>Stakeholder Directory</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="admin-tab-content animate-fade-in" key={activeTab}>
        {activeTab === 'overview' && (
          <div className="admin-tab-pane">
            <DashboardOverview totalOrders={totalOrders} revenue={revenue} users={usersCount} />
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-tab-pane card">
            <ProductManagement />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-tab-pane card">
            <AdminOrders />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-tab-pane card">
            <UserManagement />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
