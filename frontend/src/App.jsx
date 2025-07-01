import React, { useState, useEffect } from 'react';
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

  const getInitialTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addToCanvas = (content) => {
    setCanvasContent((prev) => [...prev, content]);
  };

  return (
    <div className="app-container">
      <Header toggleTheme={toggleTheme} theme={theme} />

      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          {/* Upload + Summary Section */}
          <section id="upload" className="top-section">
            <UploadSection onSummary={setSummary} onFileId={setFileId} />
            <ResultColumn summary={summary} onAddToCanvas={addToCanvas} />
          </section>

          {/* Query Section */}
          <section id="query" className="query-section-wrapper">
            <QuerySection fileId={fileId} onReceiveResult={addToCanvas} />
          </section>

          {/* Canvas Section */}
          <section id="canvas" className="canvas-section-wrapper">
            <CanvasSection content={canvasContent} fileId={fileId} />
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
