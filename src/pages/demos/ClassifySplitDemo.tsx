import React, { useState } from 'react';
import FileInput from './FileInput';
import { classifyAndSplit } from '../../services/contentApi';
import type { ClassifySplitResult } from '../../types';
import { SCENARIOS } from '../../types';
import './demos.css';

const scenario = SCENARIOS.find((s) => s.id === 'classify-split')!;

const ClassifySplitDemo: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassifySplitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'summary' | 'json'>('summary');

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    const res = await classifyAndSplit(file);
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
      {loading && <div className="demo-loading"><span className="spinner" /> Classifying documents…</div>}

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
                  <div className="card-label">Total Pages</div>
                  <div className="card-value">{result.totalPages}</div>
                </div>
                <div className="summary-card">
                  <div className="card-label">Documents Found</div>
                  <div className="card-value">{result.sections.length}</div>
                </div>
              </div>

              <div className="section-list">
                {result.sections.map((s) => (
                  <div key={s.index} className="section-item">
                    <div className="section-index">{s.index + 1}</div>
                    <div className="section-info">
                      <div className="section-class">{s.classification}</div>
                      <div className="section-pages">Pages {s.pageRange[0]}–{s.pageRange[1]}</div>
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

export default ClassifySplitDemo;
