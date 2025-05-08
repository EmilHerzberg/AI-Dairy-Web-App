// frontend/index.js

/**
 * Purpose:
 *  - Main entry point for the React frontend.
 *  - Initializes the React application, sets up routing, and wraps the app with AuthProvider.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Importing Bootstrap and CSS styles for consistent styling across the app
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css';

// Main application component
import App from './App';
import reportWebVitals from './reportWebVitals';

// This is the main entry point for the React frontend.
// It initializes the React application, sets up routing, and wraps the app in the authentication provider

// Create the root to render our React app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the React application inside the 'root' DOM element
root.render(
  <React.StrictMode>
    {/*
      The Router component wraps the entire app,
      enabling client-side navigation using React Router.
    */}
    <Router>
      {/*
        The AuthProvider makes authentication data and methods
        (login, register, etc.) available to all children.
      */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

// Report performance metrics (optional)
reportWebVitals();
