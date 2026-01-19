import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Developer Signature
console.log(
  "%c ATOMIC EXPLORER %c v1.0.0 \n%c Developed by Costas Pinto ",
  "background: #06b6d4; color: #000; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;",
  "background: #0f172a; color: #fff; padding: 4px 8px; border-radius: 0 4px 4px 0;",
  "color: #94a3b8; font-size: 10px; margin-top: 5px;"
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);