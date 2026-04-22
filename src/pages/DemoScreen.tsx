import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SCENARIOS, ScenarioId } from '../types';
import InvoiceDemo from './demos/InvoiceDemo';
import ClassifySplitDemo from './demos/ClassifySplitDemo';
import ImageSummaryDemo from './demos/ImageSummaryDemo';
import AudioAnalysisDemo from './demos/AudioAnalysisDemo';
import VideoAnalysisDemo from './demos/VideoAnalysisDemo';
import CustomFormDemo from './demos/CustomFormDemo';
import MarkdownDemo from './demos/MarkdownDemo';
import ReviewDemo from './demos/ReviewDemo';
import './DemoScreen.css';

const demoComponents: Record<ScenarioId, React.FC> = {
  'invoice': InvoiceDemo,
  'classify-split': ClassifySplitDemo,
  'image-summary': ImageSummaryDemo,
  'audio-analysis': AudioAnalysisDemo,
  'video-analysis': VideoAnalysisDemo,
  'custom-form': CustomFormDemo,
  'markdown': MarkdownDemo,
  'review': ReviewDemo,
};

const DemoScreen: React.FC = () => {
  const { scenario } = useParams<{ scenario: string }>();
  const navigate = useNavigate();
  const scenarioId = scenario as ScenarioId;
  const scenarioInfo = SCENARIOS.find((s) => s.id === scenarioId);
  const DemoComponent = demoComponents[scenarioId];

  if (!scenarioInfo || !DemoComponent) {
    return (
      <div className="demo-screen">
        <div className="demo-not-found">
          Scenario not found.
          <br />
          <button className="btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/features')} type="button">
            Back to demos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="demo-screen">
      <div className="demo-header">
        <button className="demo-back" onClick={() => navigate('/features')} type="button" aria-label="Back">←</button>
        <h1>{scenarioInfo.icon} {scenarioInfo.label}</h1>
      </div>
      <p className="demo-subtitle">{scenarioInfo.description}</p>
      <div className="demo-body">
        <DemoComponent />
      </div>
    </div>
  );
};

export default DemoScreen;
