import React, { useState, useRef, useCallback } from 'react';
import '../styles/CanvasEditor.css';

export default function CanvasEditor({ images = [] }) {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingText, setEditingText] = useState(false);
  const [removedImagePaths, setRemovedImagePaths] = useState(new Set());
  const canvasRef = useRef(null);

  const addImage = (imagePath) => {
    const newElement = {
      id: Date.now() + Math.random(),
      type: 'image',
      src: imagePath,
      x: 50,
      y: 50,
      width: 300,
      height: 200,
      zIndex: elements.length
    };
    setElements(prev => [...prev, newElement]);
  };

  const addText = () => {
    const newElement = {
      id: Date.now() + Math.random(),
      type: 'text',
      content: 'Click to edit text',
      x: 100,
      y: 100,
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#000000',
      fontWeight: 'normal',
      fontStyle: 'normal',
      zIndex: elements.length
    };
    setElements(prev => [...prev, newElement]);
  };

  const handleMouseDown = (e, element) => {
    if (editingText) return;

    e.preventDefault();
    e.stopPropagation();
    setSelectedElement(element.id);
    setIsDragging(true);

    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !selectedElement || editingText) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    // Get canvas dimensions for boundary checking
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    setElements(elements =>
      elements.map(el => {
        if (el.id === selectedElement) {
          // Ensure element stays within canvas bounds
          const maxX = canvasWidth - (el.width || 100);
          const maxY = canvasHeight - (el.height || 50);

          return {
            ...el,
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
          };
        }
        return el;
      })
    );
  }, [isDragging, selectedElement, dragOffset, editingText]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleResize = (elementId, newWidth, newHeight) => {
    setElements(elements =>
      elements.map(el =>
        el.id === elementId
          ? { ...el, width: Math.max(50, newWidth), height: Math.max(30, newHeight) }
          : el
      )
    );
  };

  const removeElement = (elementId) => {
    console.log('Removing element:', elementId);
    console.log('Current elements before removal:', elements);

    const elementToRemove = elements.find(el => el.id === elementId);
    
    // If it's an image being removed, track its path
    if (elementToRemove && elementToRemove.type === 'image') {
      setRemovedImagePaths(prev => new Set([...prev, elementToRemove.src]));
    }

    setElements(prev => {
      const filtered = prev.filter(el => el.id !== elementId);
      console.log('Elements after filter:', filtered);
      return filtered;
    });
    setSelectedElement(null);
    setEditingText(false);
  };

  const updateTextElement = (elementId, updates) => {
    setElements(prev =>
      prev.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      )
    );
  };

  const handleTextContentChange = (elementId, newContent) => {
    setElements(prev =>
      prev.map(el =>
        el.id === elementId ? { ...el, content: newContent } : el
      )
    );
  };

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null);
      setEditingText(false);
    }
  };

  const handleRemoveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Remove clicked, selected element:', selectedElement);
    console.log('Current elements:', elements);

    if (selectedElement) {
      // Find the element to confirm it exists
      const elementToRemove = elements.find(el => el.id === selectedElement);
      console.log('Element to remove:', elementToRemove);

      if (elementToRemove) {
        removeElement(selectedElement);
      } else {
        console.warn('Element not found for removal');
      }
    }
  };

  const handleTextDoubleClick = (elementId) => {
    setSelectedElement(elementId);
    setEditingText(true);
  };

  const handleTextEditEnd = () => {
    setEditingText(false);
  };

  React.useEffect(() => {
    const currentImagePaths = elements.filter(el => el.type === 'image').map(el => el.src);

    images.forEach((item) => {
      if (item.type === 'image' && 
          !currentImagePaths.includes(item.imagePath) && 
          !removedImagePaths.has(item.imagePath)) {
        addImage(item.imagePath);
      }
    });
  }, [images, removedImagePaths]);

  // Add a function to clear removed images (optional - for reset functionality)
  const clearRemovedImages = () => {
    setRemovedImagePaths(new Set());
  };

  return (
    <div className="canvas-editor">
      <div className="canvas-toolbar" onClick={(e) => e.stopPropagation()}>
        <button onClick={addText} className="toolbar-btn">
          Add Text
        </button>
        {selectedElement && (
          <button 
            onClick={handleRemoveClick}
            className="toolbar-btn remove-btn"
          >
            Remove Selected ({elements.find(el => el.id === selectedElement)?.type})
          </button>
        )}
        {removedImagePaths.size > 0 && (
          <button 
            onClick={clearRemovedImages}
            className="toolbar-btn"
            title="Restore all removed images"
          >
            Restore Images ({removedImagePaths.size})
          </button>
        )}
        <span style={{ marginLeft: '1rem', fontSize: '12px', color: '#666' }}>
          Elements: {elements.length} | Selected: {selectedElement ? 'Yes' : 'No'} | Removed: {removedImagePaths.size}
        </span>
      </div>

      {selectedElement && elements.find(el => el.id === selectedElement)?.type === 'text' && (
        <div onClick={(e) => e.stopPropagation()}>
          <TextControls
            element={elements.find(el => el.id === selectedElement)}
            onUpdate={(updates) => updateTextElement(selectedElement, updates)}
          />
        </div>
      )}

      <div 
        ref={canvasRef}
        className="canvas-area"
        onClick={handleCanvasClick}
      >
        {elements.map(element => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={selectedElement === element.id}
            isEditing={editingText && selectedElement === element.id}
            onMouseDown={(e) => handleMouseDown(e, element)}
            onResize={(width, height) => handleResize(element.id, width, height)}
            onDoubleClick={() => element.type === 'text' ? handleTextDoubleClick(element.id) : setSelectedElement(element.id)}
            onTextChange={(newContent) => handleTextContentChange(element.id, newContent)}
            onTextEditEnd={handleTextEditEnd}
          />
        ))}
      </div>
    </div>
  );
}

function CanvasElement({ element, isSelected, isEditing, onMouseDown, onResize, onDoubleClick, onTextChange, onTextEditEnd }) {
  const elementRef = useRef(null);
  const textRef = useRef(null);
  const [localTextContent, setLocalTextContent] = useState(element.content);
  const isInitialMount = useRef(true);

  // Update local content when element content changes from outside
  React.useEffect(() => {
    if (isInitialMount.current || !isEditing) {
      setLocalTextContent(element.content);
      isInitialMount.current = false;
    }
  }, [element.content, isEditing]);

  React.useEffect(() => {
    if (isEditing && textRef.current) {
      // Set the text content first
      textRef.current.textContent = localTextContent;
      
      // Then focus and set cursor position
      textRef.current.focus();
      
      // Set cursor to end of text
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(textRef.current);
      range.collapse(false); // Collapse to end
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [isEditing]);

  const handleTextInput = (e) => {
    // Update local state only
    const newContent = e.target.textContent;
    setLocalTextContent(newContent);
  };

  const handleTextBlur = (e) => {
    // Only update parent when editing is finished
    const finalContent = e.target.textContent || 'Click to edit text';
    onTextChange(finalContent);
    onTextEditEnd();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.target.blur();
    }
    if (e.key === 'Escape') {
      // Restore original content on escape
      if (textRef.current) {
        textRef.current.textContent = element.content;
        setLocalTextContent(element.content);
      }
      e.target.blur();
    }
  };

  const handleResizeMouseDown = (e, corner) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width || 100;
    const startHeight = element.height || 100;

    const handleResizeMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (corner.includes('right')) newWidth = startWidth + deltaX;
      if (corner.includes('left')) newWidth = startWidth - deltaX;
      if (corner.includes('bottom')) newHeight = startHeight + deltaY;
      if (corner.includes('top')) newHeight = startHeight - deltaY;

      onResize(newWidth, newHeight);
    };

    const handleResizeUp = () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeUp);
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeUp);
  };

  if (element.type === 'image') {
    return (
      <div
        ref={elementRef}
        className={`canvas-element image-element ${isSelected ? 'selected' : ''}`}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          zIndex: element.zIndex
        }}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
      >
        <img
          src={element.src}
          alt="Canvas"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          draggable={false}
        />
        {isSelected && (
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
        className={`canvas-element text-element ${isSelected ? 'selected' : ''}`}
        style={{
          left: element.x,
          top: element.y,
          fontSize: element.fontSize,
          fontFamily: element.fontFamily,
          color: element.color,
          fontWeight: element.fontWeight,
          fontStyle: element.fontStyle,
          zIndex: element.zIndex
        }}
        onMouseDown={!isEditing ? onMouseDown : undefined}
        onDoubleClick={onDoubleClick}
      >
        <div
          ref={textRef}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          style={{ 
            outline: 'none', 
            minWidth: '50px', 
            minHeight: '20px',
            padding: '2px',
            backgroundColor: isEditing ? 'rgba(255,255,255,0.9)' : 'transparent',
            border: isEditing ? '1px solid #ccc' : 'none',
            borderRadius: '2px'
          }}
          onBlur={handleTextBlur}
          onInput={handleTextInput}
          onKeyDown={handleKeyDown}
        >
          {!isEditing ? element.content : ''}
        </div>
      </div>
    );
  }

  return null;
}

function TextControls({ element, onUpdate }) {
  return (
    <div className="text-controls">
      <select
        value={element.fontFamily}
        onChange={(e) => onUpdate({ fontFamily: e.target.value })}
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Georgia">Georgia</option>
      </select>
      
      <input
        type="number"
        value={element.fontSize}
        onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
        min="8"
        max="72"
        style={{ width: '60px' }}
      />
      
      <input
        type="color"
        value={element.color}
        onChange={(e) => onUpdate({ color: e.target.value })}
      />
      
      <button
        className={element.fontWeight === 'bold' ? 'active' : ''}
        onClick={() => onUpdate({ fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' })}
      >
        B
      </button>
      
      <button
        className={element.fontStyle === 'italic' ? 'active' : ''}
        onClick={() => onUpdate({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })}
      >
        I
      </button>
    </div>
  );
}