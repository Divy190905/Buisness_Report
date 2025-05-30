import React, { useState, useRef } from 'react';
import '../styles/UploadSection.css';

export default function UploadSection() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const uploadedFile = e.dataTransfer.files[0];
      if (uploadedFile.name.endsWith('.xls') || uploadedFile.name.endsWith('.xlsx')) {
        setFile(uploadedFile);
      } else {
        alert("Please upload an Excel file (.xls or .xlsx)");
      }
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <section className="upload-section">
      <h2>Upload Excel File</h2>
      <div 
        className={`file-upload-area ${dragActive ? "drag-over" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="file-upload-icon">📊</div>
        <p>Drag and drop your Excel file here</p>
        <p>or</p>
        <button className="upload-button">Browse Files</button>
        <input 
          type="file" 
          ref={inputRef}
          accept=".xls,.xlsx" 
          onChange={handleFileChange}
        />
        <p className="file-info">Supports .xls and .xlsx formats</p>
      </div>
      
      {file && (
        <div className="file-selected">
          <span>Selected: {file.name}</span>
          <button className="upload-button">Process File</button>
        </div>
      )}
    </section>
  );
}
