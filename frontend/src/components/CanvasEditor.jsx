import React, { useState, useRef, useCallback } from 'react';
import CodeEditor from './CodeEditor';
import html2canvas from 'html2canvas';
import '../styles/CanvasEditor.css';

export default function CanvasEditor({ images = [], fileId }) {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingText, setEditingText] = useState(false);
  const [removedImagePaths, setRemovedImagePaths] = useState(new Set());
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [codeEditorPosition, setCodeEditorPosition] = useState({ x: 0, y: 0 });
  const [editingCode, setEditingCode] = useState('');
  const [editingElementId, setEditingElementId] = useState(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [isHoveringEditor, setIsHoveringEditor] = useState(false);
  const canvasRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Bring element to front
  const bringToFront = (elementId) => {
    setElements(prev => {
      const maxZ = Math.max(...prev.map(el => el.zIndex || 0));
      return prev.map(el => 
        el.id === elementId 
          ? { ...el, zIndex: maxZ + 1 }
          : el
      );
    });
  };

  // Send element to back
  const sendToBack = (elementId) => {
    setElements(prev => {
      const minZ = Math.min(...prev.map(el => el.zIndex || 0));
      return prev.map(el => 
        el.id === elementId 
          ? { ...el, zIndex: minZ - 1 }
          : el
      );
    });
  };

  const addImage = (imagePath, code = '', query = '') => {
    const maxZ = elements.length > 0 ? Math.max(...elements.map(el => el.zIndex || 0)) : 0;
    const newElement = {
      id: Date.now() + Math.random(),
      type: 'image',
      src: imagePath,
      x: 50 + (elements.length * 30), // Spread them out more
      y: 50 + (elements.length * 30),
      width: 300,
      height: 200,
      zIndex: maxZ + 1,
      code: code,
      query: query,
      fileId: fileId
    };
    setElements(prev => [...prev, newElement]);
  };

  const addText = () => {
    const maxZ = elements.length > 0 ? Math.max(...elements.map(el => el.zIndex || 0)) : 0;
    const newElement = {
      id: Date.now() + Math.random(),
      type: 'text',
      content: 'Click to edit',
      x: 100 + (elements.length * 30),
      y: 100 + (elements.length * 30),
      fontSize: 16,
      fontWeight: 'normal',
      color: '#000000',
      zIndex: maxZ + 1
    };
    setElements(prev => [...prev, newElement]);
  };

  // Fixed mouse down handler for dragging
  const handleMouseDown = (e, element) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Mouse down on element:', element.id);
    
    // Bring clicked element to front
    bringToFront(element.id);
    setSelectedElement(element.id);
    
    // Calculate offset from mouse to element's top-left corner
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - element.x;
    const offsetY = e.clientY - rect.top - element.y;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    
    console.log('Start dragging:', { offsetX, offsetY });
  };

  // Fixed mouse move handler
  const handleMouseMove = useCallback((e) => {
    if (isDragging && selectedElement && canvasRef.current) {
      e.preventDefault();
      
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = Math.max(0, e.clientX - rect.left - dragOffset.x);
      const newY = Math.max(0, e.clientY - rect.top - dragOffset.y);

      setElements(prev => prev.map(el => 
        el.id === selectedElement 
          ? { ...el, x: newX, y: newY }
          : el
      ));
    }
  }, [isDragging, selectedElement, dragOffset]);

  // Fixed mouse up handler
  const handleMouseUp = useCallback((e) => {
    if (isDragging) {
      console.log('Stop dragging');
      setIsDragging(false);
    }
  }, [isDragging]);

  // Global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Canvas click handler
  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null);
      setEditingText(false);
    }
  };

  const handleResize = (elementId, width, height) => {
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, width: Math.max(50, width), height: Math.max(50, height) }
        : el
    ));
  };

  const handleTextDoubleClick = (elementId) => {
    setSelectedElement(elementId);
    setEditingText(true);
  };

  const handleTextContentChange = (elementId, newContent) => {
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, content: newContent }
        : el
    ));
  };

  const handleTextEditEnd = () => {
    setEditingText(false);
  };

  const updateTextElement = (elementId, updates) => {
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, ...updates }
        : el
    ));
  };

  const handleRemoveClick = () => {
    if (selectedElement) {
      const elementToRemove = elements.find(el => el.id === selectedElement);
      if (elementToRemove?.type === 'image') {
        setRemovedImagePaths(prev => new Set([...prev, elementToRemove.src]));
      }
      setElements(prev => prev.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  const clearRemovedImages = () => {
    setRemovedImagePaths(new Set());
  };

  const handleImageHover = (element, event) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (element.code && !isDragging && !editingText && !showCodeEditor) {
      const rect = event.currentTarget.getBoundingClientRect();
      
      let editorX = rect.right + 10;
      let editorY = rect.top;
      
      const editorWidth = 520;
      const editorHeight = 400;
      
      if (editorX + editorWidth > window.innerWidth) {
        editorX = rect.left - editorWidth - 10;
      }
      
      if (editorY + editorHeight > window.innerHeight) {
        editorY = window.innerHeight - editorHeight - 20;
      }

      setCodeEditorPosition({ x: editorX, y: editorY });
      setEditingCode(element.code || '');
      setEditingElementId(element.id);
      setShowCodeEditor(true);
    }
  };

  const handleImageLeave = () => {
    if (!isHoveringEditor && !isDragging) {
      hoverTimeoutRef.current = setTimeout(() => {
        if (!isHoveringEditor && !codeLoading) {
          setShowCodeEditor(false);
          setEditingElementId(null);
        }
      }, 300);
    }
  };

  const handleCodeEditorMouseEnter = () => {
    setIsHoveringEditor(true);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleCodeEditorMouseLeave = () => {
    setIsHoveringEditor(false);
    if (!codeLoading) {
      hoverTimeoutRef.current = setTimeout(() => {
        if (!isHoveringEditor) {
          setShowCodeEditor(false);
          setEditingElementId(null);
        }
      }, 500);
    }
  };

  const handleCodeChange = (newCode) => {
    setEditingCode(newCode);
  };

  const handleRunCode = async (code) => {
    if (!editingElementId || !fileId) {
      console.error('Missing editingElementId or fileId');
      return;
    }

    setCodeLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/query-graph/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: fileId,
          query: code,
          is_code_update: true
        }),
      });

      const data = await response.json();

      if (response.ok && (data.images || data.image_path)) {
        const newImagePath = data.images ? data.images[0] : `http://localhost:8000${data.image_path}`;
        const imageWithTimestamp = `${newImagePath}?t=${Date.now()}`;
        
        setElements(prev => prev.map(el => 
          el.id === editingElementId 
            ? { 
                ...el, 
                src: imageWithTimestamp,
                code: code 
              }
            : el
        ));
        
        setTimeout(() => {
          setShowCodeEditor(false);
          setEditingElementId(null);
          setIsHoveringEditor(false);
        }, 1000);
        
      } else {
        alert(`Error: ${data.error || 'Failed to update visualization'}`);
      }
    } catch (error) {
      console.error('Error running code:', error);
      alert(`Network error: ${error.message}`);
    } finally {
      setCodeLoading(false);
    }
  };

  const handleDownloadCanvas = async () => {
    if (!canvasRef.current) return;

    const wasVisible = showCodeEditor;
    setShowCodeEditor(false);

    await new Promise((res) => setTimeout(res, 300));

    html2canvas(canvasRef.current, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'canvas.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      if (wasVisible) {
        setShowCodeEditor(true);
      }
    }).catch((err) => {
      console.error('Download failed:', err);
      alert('Failed to download canvas image.');
    });
  };

  const renderZIndexControls = () => {
    if (!selectedElement) return null;
    
    return (
      <div className="z-index-controls">
        <button 
          onClick={() => bringToFront(selectedElement)}
          className="toolbar-btn"
          title="Bring to front"
        >
          ↑ Front
        </button>
        <button 
          onClick={() => sendToBack(selectedElement)}
          className="toolbar-btn"
          title="Send to back"
        >
          ↓ Back
        </button>
      </div>
    );
  };

  // Add images from props
  React.useEffect(() => {
    const currentImagePaths = elements.filter(el => el.type === 'image').map(el => el.src);

    images.forEach((item) => {
      if (item.type === 'image' && 
          !currentImagePaths.includes(item.imagePath) && 
          !removedImagePaths.has(item.imagePath)) {
        addImage(item.imagePath, item.code || '', item.query || '');
      }
    });
  }, [images, removedImagePaths, fileId]);

  // Cleanup
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`canvas-editor ${isDragging ? 'dragging' : ''}`}>
      <div className="canvas-toolbar">
        <button onClick={addText} className="toolbar-btn">
          Add Text
        </button>
        <button onClick={handleDownloadCanvas} className="toolbar-btn download-btn">
          Download Canvas
        </button>
        {selectedElement && (
          <>
            <button 
              onClick={handleRemoveClick}
              className="toolbar-btn remove-btn"
            >
              Remove ({elements.find(el => el.id === selectedElement)?.type})
            </button>
            {renderZIndexControls()}
          </>
        )}
        {removedImagePaths.size > 0 && (
          <button 
            onClick={clearRemovedImages}
            className="toolbar-btn"
          >
            Restore Images ({removedImagePaths.size})
          </button>
        )}
        <div className="toolbar-info">
          Elements: {elements.length} | 
          Selected: {selectedElement ? 'Yes' : 'No'} | 
          Dragging: {isDragging ? 'Yes' : 'No'}
        </div>
      </div>

      {selectedElement && elements.find(el => el.id === selectedElement)?.type === 'text' && (
        <TextControls
          element={elements.find(el => el.id === selectedElement)}
          onUpdate={(updates) => updateTextElement(selectedElement, updates)}
        />
      )}

      <div 
        ref={canvasRef}
        className="canvas-area"
        onClick={handleCanvasClick}
        onMouseDown={(e) => {
          // Only handle if clicking on canvas background
          if (e.target === canvasRef.current) {
            setSelectedElement(null);
          }
        }}
      >
        {elements
          .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
          .map(element => (
            <DraggableElement
              key={element.id}
              element={element}
              isSelected={selectedElement === element.id}
              isEditing={editingText && selectedElement === element.id}
              isDragging={isDragging && selectedElement === element.id}
              onMouseDown={(e) => handleMouseDown(e, element)}
              onResize={(width, height) => handleResize(element.id, width, height)}
              onDoubleClick={() => element.type === 'text' ? handleTextDoubleClick(element.id) : setSelectedElement(element.id)}
              onTextChange={(newContent) => handleTextContentChange(element.id, newContent)}
              onTextEditEnd={handleTextEditEnd}
              onImageHover={(e) => handleImageHover(element, e)}
              onImageLeave={handleImageLeave}
              showCodeIndicator={element.code && element.code.length > 0}
            />
          ))}
      </div>

      <CodeEditor
        code={editingCode}
        onCodeChange={handleCodeChange}
        onRunCode={handleRunCode}
        isVisible={showCodeEditor}
        position={codeEditorPosition}
        loading={codeLoading}
        onMouseEnter={handleCodeEditorMouseEnter}
        onMouseLeave={handleCodeEditorMouseLeave}
      />
    </div>
  );
}

// Separate draggable element component
function DraggableElement({ 
  element, 
  isSelected, 
  isEditing, 
  isDragging,
  onMouseDown, 
  onResize, 
  onDoubleClick, 
  onTextChange, 
  onTextEditEnd,
  onImageHover,
  onImageLeave,
  showCodeIndicator = false
}) {
  const elementRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, handle: '' });

  const handleResizeMouseDown = (e, handle) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height,
      handle
    });
  };

  const handleResizeMouseMove = useCallback((e) => {
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      
      switch (resizeStart.handle) {
        case 'bottom-right':
          newWidth = resizeStart.width + deltaX;
          newHeight = resizeStart.height + deltaY;
          break;
        case 'bottom-left':
          newWidth = resizeStart.width - deltaX;
          newHeight = resizeStart.height + deltaY;
          break;
        case 'top-right':
          newWidth = resizeStart.width + deltaX;
          newHeight = resizeStart.height - deltaY;
          break;
        case 'top-left':
          newWidth = resizeStart.width - deltaX;
          newHeight = resizeStart.height - deltaY;
          break;
      }
      
      onResize(Math.max(50, newWidth), Math.max(50, newHeight));
    }
  }, [isResizing, resizeStart, onResize]);

  const handleResizeMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
      };
    }
  }, [isResizing, handleResizeMouseMove, handleResizeMouseUp]);

  const elementStyle = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width || 'auto',
    height: element.height || 'auto',
    zIndex: element.zIndex || 0,
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none'
  };

  if (element.type === 'image') {
    return (
      <div
        ref={elementRef}
        className={`canvas-element image-element ${isSelected ? 'selected' : ''} ${showCodeIndicator ? 'has-code' : ''} ${isDragging ? 'dragging' : ''}`}
        style={elementStyle}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        onMouseEnter={onImageHover}
        onMouseLeave={onImageLeave}
      >
        <img
          src={element.src}
          alt="Canvas"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            pointerEvents: 'none'
          }}
          draggable={false}
        />
        {isSelected && !isDragging && (
          <>
            <div className="resize-handle top-left" onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')} />
            <div className="resize-handle top-right" onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')} />
            <div className="resize-handle bottom-left" onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')} />
            <div className="resize-handle bottom-right" onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')} />
          </>
        )}
      </div>
    );
  }

  if (element.type === 'text') {
    return (
      <div
        ref={elementRef}
        className={`canvas-element text-element ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
        style={{
          ...elementStyle,
          fontSize: element.fontSize,
          fontWeight: element.fontWeight,
          color: element.color,
          minWidth: '100px',
          padding: '8px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '4px'
        }}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
      >
        {isEditing ? (
          <input
            type="text"
            value={element.content}
            onChange={(e) => onTextChange(e.target.value)}
            onBlur={onTextEditEnd}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onTextEditEnd();
              }
              e.stopPropagation();
            }}
            autoFocus
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              color: 'inherit',
              width: '100%'
            }}
          />
        ) : (
          <span>{element.content}</span>
        )}
      </div>
    );
  }

  return null;
}

function TextControls({ element, onUpdate }) {
  return (
    <div className="text-controls">
      <label>
        Font Size:
        <input
          type="number"
          value={element.fontSize}
          onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
          min="8"
          max="72"
        />
      </label>
      
      <label>
        Weight:
        <select
          value={element.fontWeight}
          onChange={(e) => onUpdate({ fontWeight: e.target.value })}
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
        </select>
      </label>
      
      <label>
        Color:
        <input
          type="color"
          value={element.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
        />
      </label>
    </div>
  );
}