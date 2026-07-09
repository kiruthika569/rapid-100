import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="sireniq-header">
      <div className="brand-section">
        <div className="brand-title">
          <span className="brand-icon">S</span> SIRENIQ
        </div>
        <span className="brand-subtitle">AI Emergency Intelligence</span>
      </div>

      <div className="header-metrics">
        <div className="live-status">
          <div className="live-pulse"></div>
          <span className="live-text">(( )) LIVE</span>
        </div>
        
        <div className="duration-timer">
          <div className="timer-value">00:10</div>
          <div className="timer-label">Call Duration</div>
        </div>

        <div className="risk-indicator">
          <span className="risk-text">
            ⚡ RISK: MEDIUM
          </span>
        </div>
      </div>
    </header>
  );
}