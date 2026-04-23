import React from 'react';

interface SamplePreviewModalProps {
  sampleFile: string;
  onClose: () => void;
}

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff'];

function isImage(path: string): boolean {
  const lower = path.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

const SamplePreviewModal: React.FC<SamplePreviewModalProps> = ({ sampleFile, onClose }) => {
  const fileName = sampleFile.split('/').pop() || 'Sample File';

  return (
    <div className="sample-preview-overlay" onClick={onClose}>
      <div className="sample-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sample-preview-header">
          <span className="sample-preview-title">{fileName}</span>
          <button className="sample-preview-close" onClick={onClose} type="button" aria-label="Close preview">✕</button>
        </div>
        <div className="sample-preview-body">
          {isImage(sampleFile) ? (
            <img src={sampleFile} alt={fileName} className="sample-preview-image" />
          ) : (
            <iframe src={sampleFile} title={fileName} className="sample-preview-iframe" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SamplePreviewModal;
