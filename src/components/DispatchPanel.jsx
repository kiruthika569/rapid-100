import React from 'react';
import './DispatchPanel.css';

const Unit = ({ code, type, status, eta, statusClass }) => (
  <div className="unit-card">
    <div className="unit-info">
      <div className="unit-icon-box">
        {/* Placeholder for icon */}
        <div className="unit-icon-square" />
      </div>
      <div className="unit-details">
        <div className="unit-code">{code}</div>
        <div className="unit-type">{type}</div>
      </div>
    </div>
    <div className="unit-status-box">
      <div className={`unit-status ${statusClass}`}>{status}</div>
      <div className="unit-eta">ETA: {eta}</div>
    </div>
  </div>
);

export default function DispatchPanel() {
  return (
    <div className="glass-card full-height">
      <h3 className="card-title">
        <span className="title-icon">➤</span> DISPATCH UNITS
      </h3>
      <Unit 
        code="AMB-07" 
        type="Ambulance" 
        status="EN ROUTE" 
        eta="4 min" 
        statusClass="status-enroute" 
      />
      <Unit 
        code="PD-14" 
        type="Police" 
        status="EN ROUTE" 
        eta="6 min" 
        statusClass="status-enroute" 
      />
      <Unit 
        code="FD-03" 
        type="Fire" 
        status="DISPATCHED" 
        eta="8 min" 
        statusClass="status-dispatched" 
      />
    </div>
  );
}