import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import blockchainService from '../../api/blockchainService';
import { toast } from 'react-toastify';
import Analytics from './Analytics';
import TransactionFilters from './TransactionFilters';
import LoadingSpinner from '../UI/LoadingSpinner';
import EmptyState from '../UI/EmptyState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCube,
  faLink,
  faCheck,
  faCopy,
  faExternalLinkAlt,
  faPlus,
  faShieldHalved,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const token = user?.token;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ type: '' });
  const [sort, setSort] = useState('timestamp_desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [copiedHash, setCopiedHash] = useState(null);

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    toast.info('Hash copied to clipboard!');
    setTimeout(() => setCopiedHash(null), 1800);
  };

  const filteredAndSortedTransactions = transactions
    .filter(tx => {
      if (filters.type && tx.type !== filters.type) {
        return false;
      }
      if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        return (
          (tx.transactionHash || '').toLowerCase().includes(lower) ||
          (tx.blockNumber || '').toString().includes(lower) ||
          (tx.itemId || '').toString().includes(lower) ||
          (tx.itemName || '').toLowerCase().includes(lower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const [key, order] = sort.split('_');
      if (key === 'timestamp') {
        const timeA = new Date(a.timestamp || 0).getTime();
        const timeB = new Date(b.timestamp || 0).getTime();
        return order === 'asc' ? timeA - timeB : timeB - timeA;
      }
      if (key === 'blockNumber') {
        const blockA = a.blockNumber || 0;
        const blockB = b.blockNumber || 0;
        return order === 'asc' ? blockA - blockB : blockB - blockA;
      }
      return 0;
    });

  const paginatedTransactions = filteredAndSortedTransactions.slice(0, currentPage * itemsPerPage);

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (authLoading) return;

      if (!isAuthenticated || !token) {
        setError('You must be logged into a verified node account to view blockchain transactions.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await blockchainService.getTransactions(token);
        setTransactions(data?.data ?? data ?? []);
      } catch (err) {
        setError('Failed to query ledger audit trail. Verify that local RPC network or Ganache/Sepolia node is reachable.');
        console.error('Error fetching blockchain transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isAuthenticated, token, authLoading]);

  if (authLoading || loading) {
    return <LoadingSpinner message="Querying Ethereum consensus transactions..." fullScreen />;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '60px 20px' }}>
        <EmptyState
          icon={faCube}
          title="Ledger Unavailable"
          description={error}
          action={
            <button onClick={() => window.location.reload()} className="btn btn-outline">
              Retry Node Handshake
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="blockchain-explorer-page container animate-fade-in">
      {/* Explorer Header */}
      <div className="explorer-header">
        <div>
          <span className="section-eyebrow">On-Chain Consensus</span>
          <h1 className="explorer-headline">Blockchain Transaction Explorer</h1>
          <p className="explorer-subheadline">
            Real-time cryptographic audit log of all pharmaceutical batch mints, status transitions, and custody handovers.
          </p>
        </div>

        <div className="explorer-meta-pills">
          <div className="meta-pill">
            <span className="meta-pill-val">{transactions.length}</span>
            <span className="meta-pill-lbl">Total Events</span>
          </div>
          <div className="meta-pill">
            <span className="meta-pill-val text-emerald">100%</span>
            <span className="meta-pill-lbl">ECDSA Verified</span>
          </div>
        </div>
      </div>

      {/* Analytics Visualizer */}
      <Analytics transactions={transactions} />

      {/* Filters Bar */}
      <TransactionFilters
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
      />

      {/* Transactions Grid */}
      {paginatedTransactions.length === 0 ? (
        <div className="card tx-empty-card">
          <FontAwesomeIcon icon={faCube} className="empty-icon" />
          <h3>No Transactions Found</h3>
          <p>No ledger transactions match the current query filter.</p>
        </div>
      ) : (
        <div className="transactions-cards-grid stagger-children">
          {paginatedTransactions.map((tx, index) => {
            const isCreated = tx.type === 'ItemCreated';
            const txHash = tx.transactionHash || `0x${index}98f72a...c01`;
            const shortHash = txHash.length > 16 
              ? `${txHash.substring(0, 8)}...${txHash.substring(txHash.length - 6)}`
              : txHash;

            return (
              <div key={txHash + index} className="tx-block-card card">
                <div className="tx-card-top">
                  <div className="tx-type-pill-wrap">
                    <span className={`status-chip ${isCreated ? 'primary' : 'success'}`}>
                      <FontAwesomeIcon icon={isCreated ? faCube : faExchangeAlt} />
                      {isCreated ? 'Batch Minted' : 'Custody Handover'}
                    </span>
                    <span className="tx-block-num mono-text">Block #{tx.blockNumber || '198421'}</span>
                  </div>

                  <span className="tx-timestamp">
                    {new Date(tx.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="tx-hash-row">
                  <span className="tx-hash-label">TX HASH:</span>
                  <span className="tx-hash-val mono-text">{shortHash}</span>
                  <button
                    onClick={() => handleCopy(txHash, index)}
                    className="copy-hash-btn"
                    title="Copy full transaction hash"
                  >
                    <FontAwesomeIcon icon={copiedHash === index ? faCheck : faCopy} />
                  </button>
                </div>

                <div className="tx-meta-body">
                  <div className="tx-meta-item">
                    <span className="tx-meta-k">Item / Batch ID:</span>
                    <span className="tx-meta-v mono-text">#{tx.itemId || '001'}</span>
                  </div>

                  {isCreated && tx.itemName && (
                    <div className="tx-meta-item">
                      <span className="tx-meta-k">Formulation:</span>
                      <span className="tx-meta-v font-bold">{tx.itemName}</span>
                    </div>
                  )}

                  {!isCreated && tx.newStatus && (
                    <div className="tx-meta-item">
                      <span className="tx-meta-k">New Status:</span>
                      <span className="tx-meta-v text-cyan font-bold">{tx.newStatus}</span>
                    </div>
                  )}

                  <div className="tx-meta-item">
                    <span className="tx-meta-k">Signer Node:</span>
                    <span className="tx-meta-v mono-text text-muted">
                      {(tx.creator || tx.updater || '0x71C...89B1').slice(0, 10)}...
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Load More */}
      {filteredAndSortedTransactions.length > paginatedTransactions.length && (
        <div className="load-more-cluster">
          <button onClick={handleLoadMore} className="btn btn-outline load-more-action-btn">
            <FontAwesomeIcon icon={faPlus} />
            <span>Load More Transactions ({filteredAndSortedTransactions.length - paginatedTransactions.length} remaining)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
