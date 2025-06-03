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
  const [fileId, setFileId] = useState(null);

  const addToCanvas = (content) => {
    setCanvasContent((prev) => [...prev, content]);
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
          {/* Upload + Summary Section */}
          <div
            className="top-section"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: '100%',
              marginBottom: '2rem',
            }}
          >
            <UploadSection
              onSummary={setSummary}
              onFileId={setFileId} // This should match with implementation in UploadSection
            />
            <ResultColumn summary={summary} onAddToCanvas={addToCanvas} />
          </div>

          {/* Query Section */}
          <div
            className="query-section-wrapper"
            style={{ marginBottom: '2rem' }}
          >
            <QuerySection
              fileId={fileId}
              onReceiveResult={addToCanvas}
            />
          </div>

          {/* Canvas Section */}
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
