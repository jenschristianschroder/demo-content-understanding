import React from 'react';

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

  return (
    <div className="sample-preview-overlay" onClick={onClose}>
      <div className="sample-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sample-preview-header">
          <span className="sample-preview-title">{fileName}</span>
          <button className="sample-preview-close" onClick={onClose} type="button" aria-label="Close preview">✕</button>
        </div>
        <div className="sample-preview-body">
          {fileType === 'image' && (
            <img src={sampleFile} alt={fileName} className="sample-preview-image" />
          )}
          {fileType === 'video' && (
            <video src={sampleFile} controls className="sample-preview-video">Your browser does not support video playback.</video>
          )}
          {fileType === 'audio' && (
            <audio src={sampleFile} controls className="sample-preview-audio">Your browser does not support audio playback.</audio>
          )}
          {fileType === 'other' && (
            <iframe src={sampleFile} title={fileName} className="sample-preview-iframe" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SamplePreviewModal;
