import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import './styles/theme.css'
import './styles/checkout.css'
import './styles/checkoutFonts.css'
import 'react-checkbox-tree/lib/react-checkbox-tree.css';


import { BrowserRouter } from "react-router-dom";
import { PolarisProvider } from './components';


ReactDOM.createRoot(document.getElementById('root')).render(
  <PolarisProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PolarisProvider>
)