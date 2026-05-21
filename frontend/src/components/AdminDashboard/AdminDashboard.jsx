import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const totalOrders = 1234;
  const revenue = 567890;
  const users = 12345;

  return (
    <div className="admin-dashboard container animate-fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Control Center</h1>
        {user?.role === 'admin' && (
          <div className="admin-actions">
            <button className="btn btn-primary">Create Product</button>
            <button className="btn btn-outline">Add User</button>
          </div>
        )}
      </div>

      <div className="dashboard-content">
        <DashboardOverview totalOrders={totalOrders} revenue={revenue} users={users} />

        <div className="admin-section card">
          <ProductManagement />
        </div>

        <div className="admin-section card">
          <AdminOrders />
        </div>

        <div className="admin-section card">
          <UserManagement />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
