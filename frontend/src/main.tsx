import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppFixed from './AppFixed.tsx'
import { ErrorBoundary } from './ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppFixed />
    </ErrorBoundary>
  </StrictMode>,
)
