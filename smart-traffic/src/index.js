


import React from 'react';
import ReactDOM from 'react-dom/client';  // Import from 'react-dom/client'
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

// Create a root using React 18's createRoot method
const root = ReactDOM.createRoot(rootElement);

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
