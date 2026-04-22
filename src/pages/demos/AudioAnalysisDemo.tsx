import React, { useState } from 'react';
import FileInput from './FileInput';
import { analyzeAudio } from '../../services/contentApi';
import type { AudioAnalysisResult } from '../../types';
import { SCENARIOS } from '../../types';
import './demos.css';

const scenario = SCENARIOS.find((s) => s.id === 'audio-analysis')!;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const AudioAnalysisDemo: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AudioAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'summary' | 'transcript' | 'json'>('summary');

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    const res = await analyzeAudio(file);
    setLoading(false);
    if (res.success && res.data) setResult(res.data);
    else setError(res.error || 'Analysis failed');
  };

  return (
    <div className="demo-panel">
      <FileInput accept={scenario.acceptedFormats} sampleFile={scenario.sampleFile} onFileSelected={setFile} />

      <div className="demo-actions">
        <button className="btn-primary" onClick={run} disabled={!file || loading} type="button">
          {loading ? <><span className="spinner" /> Analyzing…</> : 'Run Demo'}
        </button>
      </div>

      {error && <div className="demo-error">{error}</div>}
      {loading && <div className="demo-loading"><span className="spinner" /> Analyzing audio…</div>}

      {result && (
        <div className="demo-result-section">
          <div className="tab-bar">
            <button className={tab === 'summary' ? 'active' : ''} onClick={() => setTab('summary')}>Summary</button>
            <button className={tab === 'transcript' ? 'active' : ''} onClick={() => setTab('transcript')}>Transcript</button>
            <button className={tab === 'json' ? 'active' : ''} onClick={() => setTab('json')}>JSON</button>
          </div>

          {tab === 'summary' && (
            <>
              <div className="summary-grid">
                <div className="summary-card">
                  <div className="card-label">Duration</div>
                  <div className="card-value">{formatTime(result.duration)}</div>
                </div>
                <div className="summary-card">
                  <div className="card-label">Speakers</div>
                  <div className="card-value">{new Set(result.speakers.map((s) => s.speaker)).size}</div>
                </div>
              </div>
              <div style={{ fontSize: '1rem', lineHeight: 1.6 }}>{result.summary}</div>
            </>
          )}

          {tab === 'transcript' && (
            <div className="transcript-panel transcript-area">
              {result.speakers.map((seg, i) => (
                <div key={i} className="speaker-segment">
                  <div className="speaker-label">{seg.speaker} · {formatTime(seg.startTime)}</div>
                  <div className="speaker-text">{seg.text}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'json' && (
            <pre className="json-panel result-area">{JSON.stringify(result.rawJson, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioAnalysisDemo;
