import React, { useEffect, useState } from 'react';

interface SamplePreviewModalProps {
  sampleFile: string;
  onClose: () => void;
}

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff'];
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm'];
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.ogg'];

function getFileType(path: string): 'image' | 'video' | 'audio' | 'other' {
  const lower = path.toLowerCase();
  if (IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext))) return 'image';
  if (VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext))) return 'video';
  if (AUDIO_EXTENSIONS.some((ext) => lower.endsWith(ext))) return 'audio';
  return 'other';
}

const SamplePreviewModal: React.FC<SamplePreviewModalProps> = ({ sampleFile, onClose }) => {
  const fileName = sampleFile.split('/').pop() || 'Sample File';
  const fileType = getFileType(sampleFile);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let revoked = false;
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
  }, [sampleFile]);

  return (
    <div className="sample-preview-overlay" onClick={onClose}>
      <div className="sample-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sample-preview-header">
          <span className="sample-preview-title">{fileName}</span>
          <button className="sample-preview-close" onClick={onClose} type="button" aria-label="Close preview">✕</button>
        </div>
        <div className="sample-preview-body">
          {error && <div className="demo-error">{error}</div>}
          {!blobUrl && !error && <div className="demo-loading"><span className="spinner" /> Loading preview…</div>}
          {blobUrl && fileType === 'image' && (
            <img src={blobUrl} alt={fileName} className="sample-preview-image" />
          )}
          {blobUrl && fileType === 'video' && (
            <video src={blobUrl} controls className="sample-preview-video">Your browser does not support video playback.</video>
          )}
          {blobUrl && fileType === 'audio' && (
            <audio src={blobUrl} controls className="sample-preview-audio">Your browser does not support audio playback.</audio>
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
