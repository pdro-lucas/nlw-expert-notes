import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'

import { App } from './app'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster richColors />
  </React.StrictMode>,
)
