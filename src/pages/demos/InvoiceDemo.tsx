import React, { useState } from 'react';
import FileInput from './FileInput';
import { analyzeInvoice } from '../../services/contentApi';
import type { InvoiceResult } from '../../types';
import { SCENARIOS } from '../../types';
import './demos.css';

const scenario = SCENARIOS.find((s) => s.id === 'invoice')!;

const InvoiceDemo: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InvoiceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'summary' | 'json'>('summary');

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    const res = await analyzeInvoice(file);
    setLoading(false);
    if (res.success && res.data) { setResult(res.data); }
    else { setError(res.error || 'Analysis failed'); }
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

      {loading && <div className="demo-loading"><span className="spinner" /> Processing invoice…</div>}

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
                  <div className="card-label">Vendor</div>
                  <div className="card-value">{result.vendor}</div>
                </div>
                <div className="summary-card">
                  <div className="card-label">Invoice #</div>
                  <div className="card-value">{result.invoiceNumber}</div>
                </div>
                <div className="summary-card">
                  <div className="card-label">Date</div>
                  <div className="card-value">{result.date}</div>
                </div>
                <div className="summary-card">
                  <div className="card-label">Total</div>
                  <div className="card-value">{result.currency} {result.total.toFixed(2)}</div>
                </div>
              </div>

              {result.lineItems.length > 0 && (
                <table className="data-table">
                  <thead>
                    <tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr>
                  </thead>
                  <tbody>
                    {result.lineItems.map((item, i) => (
                      <tr key={i}>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unitPrice.toFixed(2)}</td>
                        <td>{item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

export default InvoiceDemo;
