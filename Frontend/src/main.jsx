import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';  // importa o CSS global uma vez aqui
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import NewsLetter from './components/NewsLetter.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
