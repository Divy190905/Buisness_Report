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
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <div className="top-section" style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
            <UploadSection onSummary={setSummary} />
            <ResultColumn summary={summary} onAddToCanvas={addToCanvas} />
          </div>
          <CanvasSection content={canvasContent} />
          <QuerySection onReceiveResult={(result) => addToCanvas(result)} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
