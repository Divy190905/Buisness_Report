import React from 'react';
import '../styles/ResultColumn.css';

export default function ResultColumn({ summary }) {
  return (
    <section className="result-column">
      <h2>Report Summary</h2>
      {summary ? (
        <div className="result-scroll-box" dangerouslySetInnerHTML={{ __html: summary }} />
      ) : (
        <p className="no-results">Results will appear here after upload and analysis.</p>
      )}
    </section>
  );
}
