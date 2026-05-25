import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppFixed from './AppFixed.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppFixed />
  </StrictMode>,
)
