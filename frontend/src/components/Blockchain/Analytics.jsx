import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faChartLine, faCube } from '@fortawesome/free-solid-svg-icons';
import './Analytics.css';

const COLORS = ['#FF6B00', '#00E5FF', '#00F5A0', '#8B5CF6', '#F43F5E'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        <span className="tooltip-label">{label || payload[0].name}</span>
        <span className="tooltip-value mono-text">{payload[0].value} event(s)</span>
      </div>
    );
  }
  return null;
};

const Analytics = ({ transactions = [] }) => {
  if (!transactions || transactions.length === 0) {
    return null;
  }

  // Aggregate transaction types
  const transactionTypes = transactions.reduce((acc, tx) => {
    const t = tx.type || 'Standard';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(transactionTypes).map(key => ({
    name: key === 'ItemCreated' ? 'Batch Minted' : key === 'ItemStatusUpdated' ? 'Custody Updated' : key,
    value: transactionTypes[key],
  }));

  // Aggregate by date
  const transactionsByDate = transactions.reduce((acc, tx) => {
    const date = new Date(tx.timestamp || Date.now()).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const areaData = Object.keys(transactionsByDate).map(key => ({
    date: key,
    count: transactionsByDate[key],
  }));

  return (
    <div className="analytics-dashboard-grid">
      {/* Metric 1: Type Distribution Pie */}
      <div className="analytics-chart-card card">
        <div className="chart-header">
          <FontAwesomeIcon icon={faChartPie} className="text-orange" />
          <h3 className="chart-title">Consensus Event Distribution</h3>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric 2: Transaction Volume Over Time Area Chart */}
      <div className="analytics-chart-card card">
        <div className="chart-header">
          <FontAwesomeIcon icon={faChartLine} className="text-cyan" />
          <h3 className="chart-title">Ledger Throughput Over Time</h3>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cyberAreaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--text-muted)" 
                fontSize={11} 
                tickLine={false} 
              />
              <YAxis 
                stroke="var(--text-muted)" 
                fontSize={11} 
                tickLine={false} 
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#00E5FF"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#cyberAreaGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
