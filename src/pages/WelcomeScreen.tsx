import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Content Understanding</h1>
      <p className="welcome-subtitle">
        Experience Azure AI Content Understanding — extract, classify, summarise, and convert documents, images, audio, and video with a single unified service.
      </p>
      <button className="welcome-cta" onClick={() => navigate('/features')} type="button">
        Try the Demos
      </button>
      <div className="welcome-footer">Microsoft Innovation Hub Denmark</div>
    </div>
  );
};

export default WelcomeScreen;
