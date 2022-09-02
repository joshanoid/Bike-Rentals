import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { Layout } from 'components/Layout'
import { Router } from 'components/Router'

import './index.css'

const rootElement = document.createElement('div')
const root = createRoot(rootElement)

document.body.append(rootElement)

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Layout>
                <Router />
            </Layout>
        </BrowserRouter>
    </React.StrictMode>,
)
