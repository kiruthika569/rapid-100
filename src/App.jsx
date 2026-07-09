import React from "react";
import Header from "./components/Header";
import LiveCall from "./components/LiveCall";
import MetricsGrid from "./components/MetricsGrid";
import DispatchPanel from "./components/DispatchPanel";
import ActionsPanel from "./components/ActionPanel";
import './App.css';

export default function App() {
  return (
    <div className="dashboard-root">
      <Header extraClass="glow-header" />

      <div className="dashboard-main">
        {/* 1. Live Call - Stretches Vertically */}
        <div className="glow-card glow-cyan livecall-column">
          <LiveCall />
        </div>

        {/* 2. Top Middle: Risk Score (Now HIGH with Graph) */}
        <div className="glow-card glow-purple risk-card">
          <div className="risk-header">
            <h3 className="card-title">RISK LEVEL</h3>
            <div className="risk-status status-high">HIGH</div>
          </div>
          <div className="risk-graph-container">
            <svg width="100%" height="60" viewBox="0 0 100 40" preserveAspectRatio="none">
              <path 
                d="M0 35 L15 32 L30 38 L50 15 L70 25 L85 5 L100 12" 
                fill="none" 
                stroke="#bc13fe" 
                strokeWidth="3"
                strokeLinecap="round"
                className="graph-line-path"
              />
            </svg>
          </div>
        </div>

        {/* 3. Top Right: Confidence */}
        <div className="glow-card glow-cyan confidence-card">
          <MetricsGrid type="confidence" title="AI CONFIDENCE" value="64%" />
        </div>

        {/* 4. Middle Center: Assessment */}
        <div className="glow-card glow-purple sentiment-card">
          <h3 className="card-title">AI ASSESSMENT</h3>
          <ul className="assessment-list">
            <li className="status-positive">✓ Injury Detected</li>
            <li className="status-positive">✓ Location Identified</li>
            <li className="status-neutral" style={{opacity: 0.6}}>○ No Weapons Spotted</li>
          </ul>
        </div>

        {/* 5. Middle Right: Breakdown */}
        <div className="glow-card glow-pink breakdown-card">
          <MetricsGrid type="breakdown" title="INCIDENT BREAKDOWN" />
        </div>

        {/* 6. Bottom Wide: Dispatch */}
        <div className="glow-card glow-purple dispatch-panel">
          <DispatchPanel />
        </div>

        {/* 7. Bottom Right: Actions */}
        <div className="glow-card glow-pink actions-panel">
          <ActionsPanel />
        </div>
      </div>
    </div>
  );
}