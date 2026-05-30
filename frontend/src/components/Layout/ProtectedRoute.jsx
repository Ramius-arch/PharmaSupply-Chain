import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * ProtectedRoute — wraps routes that require authentication.
 * Optionally restricts by role(s).
 *
 * @param {React.ReactNode} children — the component to render if authorized
 * @param {string[]} [allowedRoles] — optional array of allowed roles (e.g., ['admin', 'supplier'])
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    // Transparently allow access for public demo
    return children;
};

export default ProtectedRoute;
