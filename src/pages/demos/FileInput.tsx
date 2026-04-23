import React, { useRef, useState, useCallback } from 'react';
import SamplePreviewModal from './SamplePreviewModal';

interface FileInputProps {
  accept: string;
  sampleFile: string;
  onFileSelected: (file: File) => void;
}

const FileInput: React.FC<FileInputProps> = ({ accept, sampleFile, onFileSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    onFileSelected(file);
  }, [onFileSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const loadSample = async () => {
    try {
      const res = await fetch(sampleFile);
      if (!res.ok) throw new Error('Sample not found');
      const blob = await res.blob();
      const name = sampleFile.split('/').pop() || 'sample';
      const file = new File([blob], name, { type: blob.type });
      handleFile(file);
    } catch {
      alert('Could not load sample file. Make sure sample assets are available.');
    }
  };

  return (
    <div className="demo-input-section">
      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" accept={accept} onChange={handleChange} style={{ display: 'none' }} />
        {fileName
          ? <div className="file-name">📎 {fileName}</div>
          : <div>Drop a file here or tap to browse</div>
        }
      </div>
      <div className="demo-actions">
        <button className="btn-secondary" onClick={loadSample} type="button">Use Sample File</button>
        <button className="btn-link" onClick={() => setShowPreview(true)} type="button">Preview Sample</button>
      </div>
      {showPreview && <SamplePreviewModal sampleFile={sampleFile} onClose={() => setShowPreview(false)} />}
    </div>
  );
};

export default FileInput;
