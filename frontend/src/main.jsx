import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "1098681507359-nb9ia7pr1s0itmva86anpeafc7jp7ppb.apps.googleusercontent.com";
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <GoogleOAuthProvider clientId={clientId}>
    <App />
    
    </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
