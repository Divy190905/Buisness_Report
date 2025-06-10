import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import '../styles/CodeEditor.css';

const CodeEditor = ({ 
  code, 
  onCodeChange, 
  onRunCode, 
  isVisible, 
  position,
  loading = false,
  onMouseEnter,
  onMouseLeave
}) => {
  const [currentCode, setCurrentCode] = useState(code);
  const editorRef = useRef(null);

  // Update local code when prop changes
  React.useEffect(() => {
    setCurrentCode(code);
  }, [code]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Set up Python syntax highlighting
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
      }
    });
    
    monaco.editor.setTheme('custom-dark');
  };

  const handleCodeChange = (value) => {
    setCurrentCode(value);
    if (onCodeChange) {
      onCodeChange(value);
    }
  };

  const handleRunCode = () => {
    if (onRunCode && currentCode) {
      onRunCode(currentCode);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="code-editor-overlay"
      style={{
        left: position.x,
        top: position.y,
      }}
      onKeyDown={handleKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="code-editor-header">
        <span className="code-editor-title">Python Code Editor</span>
        <div className="code-editor-actions">
          <button 
            className="run-button"
            onClick={handleRunCode}
            disabled={loading}
            title="Ctrl+Enter to run"
          >
            {loading ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>
      
      <div className="code-editor-container">
        <Editor
          height="300px"
          width="500px"
          language="python"
          value={currentCode}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on'
          }}
        />
      </div>
      
      <div className="code-editor-footer">
        <span className="help-text">Press Ctrl+Enter to run code</span>
      </div>
    </div>
  );
};

export default CodeEditor;