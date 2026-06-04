import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import './styles/index.css';

// Defensive loading of Google Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error(
    "FATAL ERROR: VITE_GOOGLE_CLIENT_ID is missing from environment variables.\n" +
    "Check your .env file or Vercel dashboard."
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Only render provider if ID exists to avoid library internal crashes */}
    {GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        background: '#1a1a1a',
        color: '#ff4d4d',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1>Configuration Error</h1>
        <p>Google Client ID is missing. Please check your environment variables.</p>
        <code style={{ background: '#000', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
          VITE_GOOGLE_CLIENT_ID is undefined
        </code>
      </div>
    )}
  </StrictMode>,
);
