import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import './TransactionFilters.css';

const TransactionFilters = ({ onFilterChange, onSortChange, onSearchChange }) => {
  return (
    <div className="tx-filters-card card">
      {/* Search Input */}
      <div className="tx-search-box">
        <FontAwesomeIcon icon={faSearch} className="tx-search-icon" />
        <input
          type="text"
          placeholder="Search by transaction hash, block number, or item ID..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="tx-search-input"
        />
      </div>

      {/* Selectors Group */}
      <div className="tx-selectors-group">
        <div className="tx-select-wrap">
          <FontAwesomeIcon icon={faFilter} className="tx-select-icon" />
          <select 
            id="type-filter" 
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="tx-select"
          >
            <option value="">All Events</option>
            <option value="ItemCreated">Item Minted</option>
            <option value="ItemStatusUpdated">Status Transition</option>
          </select>
        </div>

        <div className="tx-select-wrap">
          <FontAwesomeIcon icon={faSortAmountDown} className="tx-select-icon" />
          <select 
            id="sort-by" 
            onChange={(e) => onSortChange(e.target.value)}
            className="tx-select"
          >
            <option value="timestamp_desc">Timestamp (Newest First)</option>
            <option value="timestamp_asc">Timestamp (Oldest First)</option>
            <option value="blockNumber_desc">Block (Highest First)</option>
            <option value="blockNumber_asc">Block (Lowest First)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
