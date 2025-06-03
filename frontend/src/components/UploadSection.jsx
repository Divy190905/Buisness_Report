import React, { useState, useRef } from 'react';
import '../styles/UploadSection.css';

export default function UploadSection({ onSummary, onFileId }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const isValidFile = (filename) => {
    return filename.endsWith('.xls') || filename.endsWith('.xlsx') || filename.endsWith('.csv');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && isValidFile(droppedFile.name)) {
      setFile(droppedFile);
    } else {
      alert('Please upload a file with .xls, .xlsx, or .csv extension');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile.name)) {
      setFile(selectedFile);
    } else {
      alert('Only .xls, .xlsx, and .csv files are supported');
    }
  };

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('Content-Type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        onSummary('Unexpected response: ' + text);
        return;
      }

      if (response.ok) {
        onSummary(data.summary || 'No summary returned.');
        if (data.file_id && onFileId) {
          onFileId(data.file_id); // ✅ Send file_id to parent
        }
      } else {
        onSummary('Error: ' + (data.detail || JSON.stringify(data)));
      }
    } catch (error) {
      console.error('Upload error:', error);
      onSummary('Error uploading file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="upload-section">
      <h2>Upload Excel or CSV File</h2>
      <div
        className={`file-upload-area ${dragActive ? 'drag-over' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="file-upload-icon">📄</div>
        <p>Drag and drop your file here</p>
        <p>or</p>
        <button className="upload-button" type="button">Browse Files</button>
        <input
          type="file"
          ref={inputRef}
          accept=".xls,.xlsx,.csv"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <p className="file-info">Supports .xls, .xlsx, and .csv formats</p>
      </div>

      {file && (
        <div className="file-selected">
          <span>Selected: {file.name}</span>
          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Process File'}
          </button>
        </div>
      )}
    </section>
  );
}
