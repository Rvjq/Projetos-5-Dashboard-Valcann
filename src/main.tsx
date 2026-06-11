// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// StrictMode removido intencionalmente:
// ele monta componentes 2x em dev, o que consome o authorization_code
// do OAuth antes que o segundo mount possa usá-lo (invalid_grant)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);