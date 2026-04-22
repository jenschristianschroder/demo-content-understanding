import React, { useState } from 'react';
import FileInput from './FileInput';
import { convertToMarkdown } from '../../services/contentApi';
import type { MarkdownResult } from '../../types';
import { SCENARIOS } from '../../types';
import './demos.css';

const scenario = SCENARIOS.find((s) => s.id === 'markdown')!;

// Minimal markdown-to-HTML for demo rendering (handles headings, bold, italic, lists, paragraphs)
function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  html = `<p>${html}</p>`;
  return html;
}

const MarkdownDemo: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarkdownResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'rendered' | 'raw' | 'json'>('rendered');

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    const res = await convertToMarkdown(file);
    setLoading(false);
    if (res.success && res.data) setResult(res.data);
    else setError(res.error || 'Conversion failed');
  };

  return (
    <div className="demo-panel">
      <FileInput accept={scenario.acceptedFormats} sampleFile={scenario.sampleFile} onFileSelected={setFile} />

      <div className="demo-actions">
        <button className="btn-primary" onClick={run} disabled={!file || loading} type="button">
          {loading ? <><span className="spinner" /> Converting…</> : 'Run Demo'}
        </button>
      </div>

      {error && <div className="demo-error">{error}</div>}
      {loading && <div className="demo-loading"><span className="spinner" /> Converting to Markdown…</div>}

      {result && (
        <div className="demo-result-section">
          <div className="summary-grid" style={{ marginBottom: 12 }}>
            <div className="summary-card">
              <div className="card-label">Pages</div>
              <div className="card-value">{result.pageCount}</div>
            </div>
            <div className="summary-card">
              <div className="card-label">Characters</div>
              <div className="card-value">{result.markdown.length.toLocaleString()}</div>
            </div>
          </div>

          <div className="tab-bar">
            <button className={tab === 'rendered' ? 'active' : ''} onClick={() => setTab('rendered')}>Rendered</button>
            <button className={tab === 'raw' ? 'active' : ''} onClick={() => setTab('raw')}>Raw Markdown</button>
            <button className={tab === 'json' ? 'active' : ''} onClick={() => setTab('json')}>JSON</button>
          </div>

          {tab === 'rendered' && (
            <div
              className="markdown-rendered result-area"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(result.markdown) }}
            />
          )}

          {tab === 'raw' && (
            <pre className="json-panel result-area">{result.markdown}</pre>
          )}

          {tab === 'json' && (
            <pre className="json-panel result-area">{JSON.stringify(result.rawJson, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkdownDemo;
