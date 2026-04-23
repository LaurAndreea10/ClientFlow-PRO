import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { ThemeProvider } from './features/theme/ThemeContext'
import { applyInitialTheme } from './features/theme/theme'
import { LocaleProvider } from './features/locale/LocaleContext'
import { ToastProvider } from './features/toast/ToastContext'

applyInitialTheme()

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LocaleProvider>
          <ToastProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ToastProvider>
        </LocaleProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
