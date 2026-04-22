import React, { useState } from 'react';
import FileInput from './FileInput';
import { extractWithReview } from '../../services/contentApi';
import type { ReviewResult } from '../../types';
import { SCENARIOS } from '../../types';
import './demos.css';

const scenario = SCENARIOS.find((s) => s.id === 'review')!;

function confidenceClass(c: number) {
  if (c >= 0.9) return 'confidence-high';
  if (c >= 0.7) return 'confidence-medium';
  return 'confidence-low';
}

const ReviewDemo: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'review' | 'json'>('review');

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    const res = await extractWithReview(file);
    setLoading(false);
    if (res.success && res.data) setResult(res.data);
    else setError(res.error || 'Extraction failed');
  };

  const needsReviewCount = result?.fields.filter((f) => f.needsReview).length ?? 0;

  return (
    <div className="demo-panel">
      <FileInput accept={scenario.acceptedFormats} sampleFile={scenario.sampleFile} onFileSelected={setFile} />

      <div className="demo-actions">
        <button className="btn-primary" onClick={run} disabled={!file || loading} type="button">
          {loading ? <><span className="spinner" /> Extracting…</> : 'Run Demo'}
        </button>
      </div>

      {error && <div className="demo-error">{error}</div>}
      {loading && <div className="demo-loading"><span className="spinner" /> Extracting with confidence scoring…</div>}

      {result && (
        <div className="demo-result-section">
          <div className="summary-grid" style={{ marginBottom: 12 }}>
            <div className="summary-card">
              <div className="card-label">Document Type</div>
              <div className="card-value">{result.documentType}</div>
            </div>
            <div className="summary-card">
              <div className="card-label">Overall Confidence</div>
              <div className="card-value">
                <span className={`confidence-badge ${confidenceClass(result.overallConfidence)}`}>
                  {(result.overallConfidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-label">Fields Needing Review</div>
              <div className="card-value" style={{ color: needsReviewCount > 0 ? '#c62828' : '#1e7e34' }}>
                {needsReviewCount}
              </div>
            </div>
          </div>

          <div className="tab-bar">
            <button className={tab === 'review' ? 'active' : ''} onClick={() => setTab('review')}>Review</button>
            <button className={tab === 'json' ? 'active' : ''} onClick={() => setTab('json')}>JSON</button>
          </div>

          {tab === 'review' && (
            <div className="review-fields">
              {result.fields.map((f, i) => (
                <div key={i} className={`review-field ${f.needsReview ? 'needs-review' : ''}`}>
                  <div className="field-name">{f.name}</div>
                  <div className="field-value">{f.value}</div>
                  <div className="field-confidence">
                    <span className={`confidence-badge ${confidenceClass(f.confidence)}`}>
                      {(f.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  {f.needsReview && (
                    <span style={{ fontSize: '0.75rem', color: '#c62828', fontWeight: 600 }}>⚠ Review</span>
                  )}
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

export default ReviewDemo;
