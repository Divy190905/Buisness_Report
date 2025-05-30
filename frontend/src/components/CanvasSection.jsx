import React, { useState, useRef } from 'react';
import '../styles/CanvasSection.css'; // You'll need to create this CSS file

const CanvasSection = ({ content }) => {
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState('16');
  const [fontFamily, setFontFamily] = useState('Arial');
  const canvasRef = useRef(null);
  
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Convert the canvas content to an image
    const dataUrl = canvas.toDataURL('image/png');
    
    // Create a download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'business-report-canvas.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addText = () => {
    // This function would add text to the canvas with the specified formatting
    // The implementation would depend on what canvas library you're using
    console.log("Adding text with:", { textColor, fontSize, fontFamily });
  };

  return (
    <div className="canvas-section">
      <div className="canvas-toolbar">
        <div className="text-controls">
          <select 
            value={fontFamily} 
            onChange={(e) => setFontFamily(e.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
          
          <select 
            value={fontSize} 
            onChange={(e) => setFontSize(e.target.value)}
          >
            {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map(size => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>
          
          <input 
            type="color" 
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
          
          <button onClick={addText}>Add Text</button>
        </div>
        
        <div className="canvas-actions">
          <button onClick={downloadCanvas}>Download</button>
        </div>
      </div>
      
      <div className="canvas-container" ref={canvasRef}>
        {/* This is where your canvas or canvas-like element will go */}
        {/* For a simple implementation, we can just render content directly */}
        {content.map((item, index) => (
          <div key={index} className="canvas-item">
            {typeof item === 'string' ? item : (
              // Assuming items could be React components or HTML elements
              item
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CanvasSection;
