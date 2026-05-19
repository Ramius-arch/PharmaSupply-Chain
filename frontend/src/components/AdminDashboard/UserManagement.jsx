const UserManagement = () => {
  return (
    <div className="user-management">
      <div className="admin-header">
        <h2>Stakeholder & User Management</h2>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>System Role</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>USR-8821</td>
              <td style={{ fontWeight: '500' }}>Dr. John Doe</td>
              <td>john.doe@pharma-net.com</td>
              <td>
                <span className="status-chip success">Administrator</span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', marginRight: '8px' }}>Manage</button>
                <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Revoke</button>
              </td>
            </tr>
            <tr>
              <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>USR-9104</td>
              <td style={{ fontWeight: '500' }}>Global Logistics Co.</td>
              <td>shipping@logistics.example.com</td>
              <td>
                <span className="status-chip warning">Manufacturer</span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', marginRight: '8px' }}>Manage</button>
                <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Revoke</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
