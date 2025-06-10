import React from 'react';
import CanvasEditor from './CanvasEditor';
import '../styles/CanvasSection.css';

export default function CanvasSection({ content, fileId }) {
  return (
    <section className="canvas-section">
      <h2>Canvas</h2>
      <div className="canvas-content">
        {content.length === 0 && <p>No visualizations yet.</p>}
        
        {content.length > 0 && (
          <CanvasEditor 
            images={content.filter(item => item.type === 'image')} 
            fileId={fileId}
          />
        )}

        {/* Display messages separately */}
        {content.filter(item => item.type === 'message').map((item, index) => (
          <div key={index} className="canvas-message" style={{
            padding: '10px',
            margin: '10px 0',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <p>{item.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}