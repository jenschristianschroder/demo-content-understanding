import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString();

interface SamplePreviewModalProps {
  sampleFile: string;
  onClose: () => void;
}

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff'];
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm'];
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.ogg'];
const PDF_EXTENSIONS = ['.pdf'];

function getFileType(path: string): 'image' | 'video' | 'audio' | 'pdf' | 'other' {
  const lower = path.toLowerCase();
  if (IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext))) return 'image';
  if (VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext))) return 'video';
  if (AUDIO_EXTENSIONS.some((ext) => lower.endsWith(ext))) return 'audio';
  if (PDF_EXTENSIONS.some((ext) => lower.endsWith(ext))) return 'pdf';
  return 'other';
}

const PdfViewer: React.FC<{ url: string }> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const renderPdf = async () => {
      const pdf = await pdfjsLib.getDocument(url).promise;
      if (cancelled) return;
      setPageCount(pdf.numPages);
      const container = containerRef.current;
      if (!container) return;
      container.innerHTML = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        if (cancelled) break;
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-page-canvas';
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      }
    };
    renderPdf();
    return () => { cancelled = true; };
  }, [url]);

  return (
    <div className="pdf-viewer-container" ref={containerRef}>
      {pageCount === 0 && <div className="demo-loading"><span className="spinner" /> Rendering PDF…</div>}
    </div>
  );
};

const SamplePreviewModal: React.FC<SamplePreviewModalProps> = ({ sampleFile, onClose }) => {
  const fileName = sampleFile.split('/').pop() || 'Sample File';
  const fileType = getFileType(sampleFile);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let revoked = false;
    // PDFs are loaded directly by PDF.js, no blob needed
    if (fileType === 'pdf') return;
    fetch(sampleFile)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load sample file');
        return res.blob();
      })
      .then((blob) => {
        if (!revoked) setBlobUrl(URL.createObjectURL(blob));
      })
      .catch(() => {
        if (!revoked) setError('Could not load sample file.');
      });
    return () => {
      revoked = true;
      setBlobUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    };
  }, [sampleFile, fileType]);

  return (
    <div className="sample-preview-overlay" onClick={onClose}>
      <div className="sample-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sample-preview-header">
          <span className="sample-preview-title">{fileName}</span>
          <button className="sample-preview-close" onClick={onClose} type="button" aria-label="Close preview">✕</button>
        </div>
        <div className="sample-preview-body">
          {error && <div className="demo-error">{error}</div>}
          {fileType !== 'pdf' && !blobUrl && !error && <div className="demo-loading"><span className="spinner" /> Loading preview…</div>}
          {blobUrl && fileType === 'image' && (
            <img src={blobUrl} alt={fileName} className="sample-preview-image" />
          )}
          {blobUrl && fileType === 'video' && (
            <video src={blobUrl} controls className="sample-preview-video">Your browser does not support video playback.</video>
          )}
          {blobUrl && fileType === 'audio' && (
            <audio src={blobUrl} controls className="sample-preview-audio">Your browser does not support audio playback.</audio>
          )}
          {fileType === 'pdf' && (
            <PdfViewer url={sampleFile} />
          )}
          {blobUrl && fileType === 'other' && (
            <iframe src={blobUrl} title={fileName} className="sample-preview-iframe" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SamplePreviewModal;
