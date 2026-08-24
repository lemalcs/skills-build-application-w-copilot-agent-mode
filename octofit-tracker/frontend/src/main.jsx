import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import './index.css';

const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

if (!codespaceName) {
  console.warn(
    'VITE_CODESPACE_NAME is not defined. Add it to .env.local, for example: VITE_CODESPACE_NAME=my-space',
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
