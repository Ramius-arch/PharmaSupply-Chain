import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube } from '@fortawesome/free-solid-svg-icons';

const LoadingSpinner = ({ message = 'Synchronizing with Ledger...', fullScreen = false }) => {
  const content = (
    <div className="loading-overlay animate-scale-in" style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '56px', height: '56px', margin: '0 auto 16px auto' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          border: '3px solid rgba(255, 255, 255, 0.08)',
          borderTopColor: 'var(--accent-primary)',
          borderRightColor: 'var(--accent-cyan)',
          borderRadius: '50%',
          animation: 'spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        }} />
        <div style={{
          position: 'absolute',
          inset: '8px',
          border: '2px solid rgba(0, 245, 160, 0.15)',
          borderTopColor: 'var(--accent-emerald)',
          borderRadius: '50%',
          animation: 'spin 1.2s linear infinite reverse',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)',
          fontSize: '1rem',
        }}>
          <FontAwesomeIcon icon={faCube} />
        </div>
      </div>
      {message && (
        <span style={{ 
          fontSize: '0.9rem', 
          fontWeight: '600', 
          color: 'var(--text-secondary)',
          letterSpacing: '-0.01em',
          fontFamily: 'var(--font-display)' 
        }}>
          {message}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
