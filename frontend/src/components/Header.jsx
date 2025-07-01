import React from 'react';
import '../styles/Header.css';

export default function Header({ toggleTheme, theme }) {
  return (
    <header className="header">
      <div className="header-content">
        <span className="header-logo">📊</span>
        <h1>DataViz Insights</h1>
      </div>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
}