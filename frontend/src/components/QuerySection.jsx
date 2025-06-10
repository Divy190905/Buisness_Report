import React, { useState } from "react";
import "../styles/QuerySection.css";

export default function QuerySection({ fileId, onReceiveResult }) {
  const [query, setQuery] = useState("");
  const [queryHistory, setQueryHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log("Submitting query with fileId:", fileId);
  
    if (!query.trim() || !fileId) {
      console.log("Query or fileId missing.");
      return;
    }
  
    setQueryHistory([query, ...queryHistory.slice(0, 4)]);
    setQuery("");
    setLoading(true);
  
    try {
      console.log("Sending fetch request...");
      const response = await fetch("http://localhost:8000/api/query-graph/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_id: fileId,
          query: query,
        }),
      });
  
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
  
      if (response.ok && (data.images || data.image_path)) {
        const imagePath = data.images ? data.images[0] : `http://localhost:8000${data.image_path}`;
        
        onReceiveResult({
          type: 'image',
          imagePath: imagePath,
          code: data.code, // Pass the code along with the image
          query: query,
          fileId: fileId, // Pass the file ID for code updates
        });
      } else if (data.error) {
        onReceiveResult({ 
          type: 'message', 
          message: `Error: ${data.error}` 
        });
      } else {
        onReceiveResult({ 
          type: 'message', 
          message: 'No visualization generated for this query.' 
        });
      }      
    } catch (error) {
      console.error("Error querying graph:", error);
      onReceiveResult({ 
        type: 'message', 
        message: `Network error: ${error.message}` 
      });
    }
  
    setLoading(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
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
          placeholder="E.g., plot the heatmap pls"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={false}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "Ask Question"}
        </button>
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