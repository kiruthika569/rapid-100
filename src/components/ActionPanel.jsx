import React from 'react';
import './ActionPanel.css'; // We will create this file next

const ActionItem = ({ colorClass, title, subtitle }) => (
  <div className={`action-card ${colorClass}`}>
    <div className="action-content">
      <div className="action-indicator animate-pulse"></div>
      <div className="action-text">
        <h4 className="action-title">{title}</h4>
        <p className="action-subtitle">{subtitle}</p>
      </div>
    </div>
  </div>
);

export default function ActionsPanel() {
  return (
    <div className="glass-card full-height">
      <h3 className="card-title">RECOMMENDED ACTIONS</h3>
      <ActionItem 
        colorClass="rose" 
        title="Send Ambulance Immediately" 
        subtitle="Injury detected + victim trapped" 
      />
      <ActionItem 
        colorClass="yellow" 
        title="Dispatch Fire Unit" 
        subtitle="Smoke/Fire hazard reported" 
      />
      <ActionItem 
        colorClass="blue" 
        title="Alert Police" 
        subtitle="Multi-vehicle collision on highway" 
      />
    </div>
  );
}