import React from 'react';
import { useParams } from 'react-router-dom';
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
  const scenarioId = scenario as ScenarioId;
  const scenarioInfo = SCENARIOS.find((s) => s.id === scenarioId);
  const DemoComponent = demoComponents[scenarioId];

  if (!scenarioInfo || !DemoComponent) {
    return (
      <div className="demo-container">
        <p className="demo-not-found">Demo not found.</p>
      </div>
    );
  }

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h1 className="demo-title">{scenarioInfo.label}</h1>
      </div>
      <p className="demo-description">{scenarioInfo.description}</p>
      <div className="demo-content">
        <DemoComponent />
      </div>
    </div>
  );
};

export default DemoScreen;
