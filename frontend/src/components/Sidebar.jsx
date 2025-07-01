import React from 'react';
import '../styles/Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <a href="#upload">
              <span className="nav-icon">📤</span>
              <span>Upload</span>
            </a>
          </li>
          <li>
            <a href="#query">
              <span className="nav-icon">📝</span>
              <span>Query</span>
            </a>
          </li>
          <li>
            <a href="#canvas">
              <span className="nav-icon">📊</span>
              <span>Canvas</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
