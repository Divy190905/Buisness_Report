import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import UploadSection from './components/UploadSection';
import QuerySection from './components/QuerySection';
import ResultColumn from './components/ResultColumn';
import CanvasSection from './components/CanvasSection';
import './index.css';

function App() {
  const [canvasContent, setCanvasContent] = useState([]);
  const [summary, setSummary] = useState('');

  const addToCanvas = (content) => {
    setCanvasContent([...canvasContent, content]);
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-content" style={{ display: 'flex' }}>
        <Sidebar />
        <div
          className="content-area"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top Section: Upload and Result */}
          <div
            className="top-section"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: '100%',
              marginBottom: '2rem',
            }}
          >
            <UploadSection onSummary={setSummary} />
            <ResultColumn summary={summary} onAddToCanvas={addToCanvas} />
          </div>

          {/* Query Section */}
          <div
            className="query-section-wrapper"
            style={{ marginBottom: '2rem' }}
          >
            <QuerySection onReceiveResult={(result) => addToCanvas(result)} />
          </div>

          {/* Canvas Section - Fill remaining space */}
          <div
            className="canvas-section-wrapper"
            style={{ flexGrow: 1, minHeight: '90vh' }}
          >
            <CanvasSection content={canvasContent} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
