import React, { useState } from 'react';
import FileInput from './FileInput';
import { summarizeImage } from '../../services/contentApi';
import type { ImageSummaryResult } from '../../types';
import { SCENARIOS } from '../../types';
import './demos.css';

const scenario = SCENARIOS.find((s) => s.id === 'image-summary')!;

const ImageSummaryDemo: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImageSummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'summary' | 'json'>('summary');

  const handleFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    const res = await summarizeImage(file);
    setLoading(false);
    if (res.success && res.data) setResult(res.data);
    else setError(res.error || 'Analysis failed');
  };

  return (
    <div className="demo-panel">
      <FileInput accept={scenario.acceptedFormats} sampleFile={scenario.sampleFile} onFileSelected={handleFile} />

      {preview && (
        <div style={{ textAlign: 'center' }}>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
        </div>
      )}

      <div className="demo-actions">
        <button className="btn-primary" onClick={run} disabled={!file || loading} type="button">
          {loading ? <><span className="spinner" /> Analyzing…</> : 'Run Demo'}
        </button>
      </div>

      {error && <div className="demo-error">{error}</div>}
      {loading && <div className="demo-loading"><span className="spinner" /> Summarising image…</div>}

      {result && (
        <div className="demo-result-section">
          <div className="tab-bar">
            <button className={tab === 'summary' ? 'active' : ''} onClick={() => setTab('summary')}>Summary</button>
            <button className={tab === 'json' ? 'active' : ''} onClick={() => setTab('json')}>JSON</button>
          </div>

          {tab === 'summary' && (
            <>
              <div style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: 16 }}>{result.summary}</div>
              {result.insights.length > 0 && (
                <div className="summary-grid">
                  {result.insights.map((ins, i) => (
                    <div key={i} className="summary-card">
                      <div className="card-label">{ins.label}</div>
                      <div className="card-value">{ins.value}</div>
                    </div>
                  ))}
                </div>
              )}
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

export default ImageSummaryDemo;
