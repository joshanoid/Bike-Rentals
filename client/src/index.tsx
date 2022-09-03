import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { Layout } from 'components/Layout'
import { Router } from 'components/Router'
import { AuthProvider, useAuth } from 'utils/auth'

import './index.css'

const rootElement = document.createElement('div')
const root = createRoot(rootElement)

document.body.append(rootElement)

const App = () => {
    const [auth, setAuth] = useAuth()

    return (
        <React.StrictMode>
            <BrowserRouter>
                <AuthProvider auth={auth}>
                    <Layout>
                        <Router setAuth={setAuth} />
                    </Layout>
                </AuthProvider>
            </BrowserRouter>
        </React.StrictMode>
    )
}

root.render(<App />)
