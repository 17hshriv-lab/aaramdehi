import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'; // 1. Import yahan karo
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider> {/* 2. Pure App ko yahan wrap karo */}
      <App />
    </HelmetProvider>
  </StrictMode>,
)