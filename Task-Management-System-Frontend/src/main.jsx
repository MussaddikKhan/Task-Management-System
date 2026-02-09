/**
 * main.jsx
 * --------
 * Application entry point.
 * 
 * Renders the root App component into the DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get root element
const rootElement = document.getElementById('root');

// Create React root and render App
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
