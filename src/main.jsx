import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById('root')).render(
  <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
)
