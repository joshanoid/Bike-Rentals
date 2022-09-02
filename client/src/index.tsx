import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { Router } from './Router'

const rootElement = document.createElement('div')
const root = createRoot(rootElement)

document.body.append(rootElement)

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    </React.StrictMode>,
)
