import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Breadcrumbs.css';

const routeNames = {
  'products': 'Medicine Catalog',
  'cart': 'Shipment Cart',
  'checkout': 'Secure Checkout',
  'success': 'Order Verified',
  'my-orders': 'My Shipments',
  'blockchain-transaction': 'Ledger Explorer',
  'generate-wallet': 'Node Key Vault',
  'admin': 'Admin Control Center',
  'dashboard': 'Stakeholder Dashboard',
  'login': 'Authenticate',
  'register': 'Join Network',
  'forgot-password': 'Reset Security Key',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (location.pathname === '/') return null;

  return (
    <nav className="breadcrumbs-container" aria-label="Breadcrumb navigation">
      <Link to="/" className="breadcrumb-root-link" aria-label="Home">
        <FontAwesomeIcon icon={faHome} className="breadcrumb-home-icon" />
        <span>Hub</span>
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNames[name] || (name.length > 16 ? `${name.slice(0, 8)}...${name.slice(-4)}` : name);

        return (
          <React.Fragment key={routeTo}>
            <FontAwesomeIcon icon={faChevronRight} className="breadcrumb-separator-icon" />
            {isLast ? (
              <span className="breadcrumb-active-item" aria-current="page">
                {displayName}
              </span>
            ) : (
              <Link to={routeTo} className="breadcrumb-segment-link">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
