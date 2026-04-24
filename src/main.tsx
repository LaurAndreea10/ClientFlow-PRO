import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './components/ToastProvider'
import './index.css'
import './premium.css'

const queryClient = new QueryClient()
const appBaseUrl = new URL(document.querySelector<HTMLScriptElement>('script[type="module"]')?.src ?? window.location.href).pathname
  .split('/assets/')[0]
  .replace(/\/$/, '')
const serviceWorkerBase = appBaseUrl === '' || appBaseUrl === '/src/main.tsx' ? '' : appBaseUrl

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ToastProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </ToastProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${serviceWorkerBase || ''}/sw.js`

    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.warn('Service worker registration failed:', error)
    })
  })
}
