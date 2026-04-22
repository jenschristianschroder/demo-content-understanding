import React, { useState } from 'react';
import FileInput from './FileInput';
import { analyzeCustomForm } from '../../services/contentApi';
import type { CustomFormResult } from '../../types';
import { SCENARIOS } from '../../types';
import './demos.css';

const scenario = SCENARIOS.find((s) => s.id === 'custom-form')!;

function confidenceClass(c: number) {
  if (c >= 0.9) return 'confidence-high';
  if (c >= 0.7) return 'confidence-medium';
  return 'confidence-low';
}

const CustomFormDemo: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CustomFormResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'summary' | 'json'>('summary');

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    const res = await analyzeCustomForm(file);
    setLoading(false);
    if (res.success && res.data) setResult(res.data);
    else setError(res.error || 'Analysis failed');
  };

  return (
    <div className="demo-panel">
      <div style={{ background: '#f0f7ff', padding: 16, borderRadius: 8, fontSize: '0.9rem', color: '#333', marginBottom: 8 }}>
        <strong>Scenario:</strong> A field service company receives paper-based service request forms.
        This custom analyzer extracts key fields like customer name, service type, priority, location, and description.
      </div>

      <FileInput accept={scenario.acceptedFormats} sampleFile={scenario.sampleFile} onFileSelected={setFile} />

      <div className="demo-actions">
        <button className="btn-primary" onClick={run} disabled={!file || loading} type="button">
          {loading ? <><span className="spinner" /> Analyzing…</> : 'Run Demo'}
        </button>
      </div>

      {error && <div className="demo-error">{error}</div>}
      {loading && <div className="demo-loading"><span className="spinner" /> Analyzing form…</div>}

      {result && (
        <div className="demo-result-section">
          <div className="tab-bar">
            <button className={tab === 'summary' ? 'active' : ''} onClick={() => setTab('summary')}>Summary</button>
            <button className={tab === 'json' ? 'active' : ''} onClick={() => setTab('json')}>JSON</button>
          </div>

          {tab === 'summary' && (
            <>
              <div className="summary-grid">
                <div className="summary-card">
                  <div className="card-label">Form Type</div>
                  <div className="card-value">{result.formType}</div>
                </div>
                <div className="summary-card">
                  <div className="card-label">Fields Extracted</div>
                  <div className="card-value">{result.fields.length}</div>
                </div>
              </div>

              <div className="form-fields">
                <div className="form-field-row" style={{ fontWeight: 600, fontSize: '0.8rem', color: '#555' }}>
                  <div>Field</div><div>Value</div><div>Type</div><div>Confidence</div>
                </div>
                {result.fields.map((f, i) => (
                  <div key={i} className="form-field-row">
                    <div className="ff-label">{f.name}</div>
                    <div>{f.value}</div>
                    <div className="ff-type">{f.fieldType}</div>
                    <div>
                      <span className={`confidence-badge ${confidenceClass(f.confidence)}`}>
                        {(f.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'json' && (
            <pre className="json-panel result-area">{JSON.stringify(result.rawJson, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomFormDemo;
