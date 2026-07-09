import React from 'react';
import './MetricsGrid.css';

export default function MetricsGrid({ type, title, value, colorClass }) {
  // 1. AI Confidence Gauge Logic
  if (type === "confidence") {
    return (
      <div className="glass-card confidence-card">
        <h3 className="card-title-absolute">{title}</h3>
        <div className="confidence-gauge">
          <svg className="gauge-svg" viewBox="0 0 100 100">
            <circle className="gauge-bg" cx="50" cy="50" r="45" />
            <circle 
              className="gauge-path" 
              cx="50" 
              cy="50" 
              r="45" 
              strokeDasharray="283" 
              strokeDashoffset="102" 
            />
          </svg>
          <div className="gauge-text">
            <div className="gauge-value">{value}</div>
            <div className="gauge-label">ACCURACY</div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Updated Incident Breakdown Pie Chart Logic
  if (type === "breakdown") {
    return (
      <div className="glass-card breakdown-card">
        <h3 className="card-title">{title}</h3>
        <div className="breakdown-container">
          <div className="donut-visual">
            <div className="donut-inner-hole"></div>
          </div>
          <div className="breakdown-legend">
            <div className="legend-row">
              <span className="dot medical"></span>
              <span className="legend-label">Medical</span>
              <span className="legend-percent">35%</span>
            </div>
            <div className="legend-row">
              <span className="dot fire"></span>
              <span className="legend-label">Fire</span>
              <span className="legend-percent">25%</span>
            </div>
            <div className="legend-row">
              <span className="dot crime"></span>
              <span className="legend-label">Crime</span>
              <span className="legend-percent">28%</span>
            </div>
            <div className="legend-row">
              <span className="dot other"></span>
              <span className="legend-label">Other</span>
              <span className="legend-percent">12%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Updated Risk and Sentiment Area Charts Logic
  return (
    <div className={`glass-card metric-area-card ${colorClass}`}>
      <div className="metric-header">
        <h3 className="card-title">{title}</h3>
        <span className="metric-value">{value}</span>
      </div>
      <div className="area-chart-container">
        <svg viewBox="0 0 100 35" preserveAspectRatio="none" className="area-svg">
          <defs>
            <linearGradient id={`grad-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className="grad-stop-top" />
              <stop offset="100%" className="grad-stop-bottom" />
            </linearGradient>
          </defs>
          <path 
            className="chart-area-fill" 
            d="M0 35 V28 Q25 24 50 22 T100 18 V35 Z" 
            fill={`url(#grad-${type})`}
          />
          <path 
            className="chart-line-stroke" 
            d="M0 28 Q25 24 50 22 T100 18" 
            fill="none" 
            strokeWidth="1.5" 
          />
        </svg>
      </div>
    </div>
  );
}