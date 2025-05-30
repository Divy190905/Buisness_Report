import React, { useState } from 'react';
import '../styles/QuerySection.css';

export default function QuerySection() {
  const [query, setQuery] = useState('');
  const [queryHistory, setQueryHistory] = useState([]);
  
  const handleSubmit = () => {
    if (query.trim()) {
      setQueryHistory([query, ...queryHistory.slice(0, 4)]);
      setQuery('');
      // Here you would normally also handle the query submission to your backend
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  const selectQuery = (oldQuery) => {
    setQuery(oldQuery);
  };

  return (
    <section className="query-section">
      <h2>Ask a Query</h2>
      <p>Ask questions about your data in natural language</p>
      
      <div className="query-input-container">
        <input 
          type="text" 
          placeholder="E.g., What were the total sales in Q1 2023?" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSubmit}>Ask Question</button>
      </div>
      
      {queryHistory.length > 0 && (
        <div className="query-history">
          <h3>Recent Queries</h3>
          {queryHistory.map((q, index) => (
            <div 
              key={index} 
              className="query-history-item"
              onClick={() => selectQuery(q)}
            >
              {q}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
