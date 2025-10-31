
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import App from './App'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
