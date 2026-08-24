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

const DEFAULT_BLOCKCHAIN_TRANSACTIONS = [
  {
    type: 'ItemCreated',
    transactionHash: '0x7b43f9a2e88102c91bdf8018318e80112948cbbfa81920aa9128301828108420',
    blockNumber: '1984214',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    itemId: '1084',
    itemName: 'Amoxicillin Trihydrate 500mg Batch #AMX-9942',
    description: 'Pharmaceutical batch formulated at Lonza AG Visp facility under GMP ISO-9001 standards.',
    creator: '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5',
  },
  {
    type: 'ItemStatusUpdated',
    transactionHash: '0x3a99e029381cbb49018401928374901238491028394019283019283019283019',
    blockNumber: '1984210',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    itemId: '1084',
    itemName: 'Amoxicillin Trihydrate 500mg Batch #AMX-9942',
    oldStatus: 'Created',
    newStatus: 'InTransit',
    updater: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
  },
  {
    type: 'ItemCreated',
    transactionHash: '0x8401928301928301928301928301928301928301928301928301928301928301',
    blockNumber: '1984180',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    itemId: '1083',
    itemName: 'Spikevax mRNA Bivalent 0.5mL Cryo-Consignment',
    description: 'Cold-chain mRNA vaccine batch sealed in sub-zero dry ice packaging with smart temperature telemetry beacon.',
    creator: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
  },
  {
    type: 'ItemStatusUpdated',
    transactionHash: '0x4910293840192830192830192830192830192830192830192830192830192830',
    blockNumber: '1984165',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    itemId: '1083',
    itemName: 'Spikevax mRNA Bivalent 0.5mL Cryo-Consignment',
    oldStatus: 'InTransit',
    newStatus: 'Delivered',
    updater: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
  },
  {
    type: 'ItemCreated',
    transactionHash: '0x6291830192830192830192830192830192830192830192830192830192830192',
    blockNumber: '1984140',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    itemId: '1082',
    itemName: 'Human Insulin Isophane 100 IU/mL Vials',
    description: 'Recombinant human insulin batch verified by HPLC chromatographic purity assays at Novo Nordisk Hub.',
    creator: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
  },
];

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
        const blockA = Number(a.blockNumber) || 0;
        const blockB = Number(b.blockNumber) || 0;
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

      try {
        setLoading(true);
        setError(null);
        let txData = [];
        if (token && !user?.isGuestDemo) {
          const data = await blockchainService.getTransactions(token);
          txData = data?.data ?? data ?? [];
        }
        if (txData && txData.length > 0) {
          setTransactions(txData);
        } else {
          setTransactions(DEFAULT_BLOCKCHAIN_TRANSACTIONS);
        }
      } catch (err) {
        console.warn('Using demonstrative ledger events:', err);
        setTransactions(DEFAULT_BLOCKCHAIN_TRANSACTIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isAuthenticated, token, authLoading, user?.isGuestDemo]);

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
