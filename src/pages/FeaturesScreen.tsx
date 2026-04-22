import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SCENARIOS } from '../types';
import './FeaturesScreen.css';

const FeaturesScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="features-screen">
      <div className="features-header">
        <h1>Choose a Demo</h1>
        <button className="features-close" onClick={() => navigate('/')} type="button" aria-label="Close">✕</button>
      </div>
      <div className="features-grid">
        {SCENARIOS.map((s) => (
          <button key={s.id} className="feature-card" onClick={() => navigate(`/demo/${s.id}`)} type="button">
            <span className="card-icon">{s.icon}</span>
            <span className="card-label">{s.label}</span>
            <span className="card-desc">{s.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeaturesScreen;
