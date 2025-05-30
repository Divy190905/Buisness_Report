import React from 'react';
import '../styles/Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Upload</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </nav>
    </aside>
  );
}
