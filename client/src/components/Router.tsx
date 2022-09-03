import * as React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'

import { Home } from 'pages/Home'
import { Login } from 'pages/Login'
import { Logout } from 'pages/Logout'
import { Dashboard } from 'pages/Dashboard'
import { useAuthContext } from 'utils/auth'
import { Auth } from 'utils/types'

type ProtectedRouteProps = {
    children: JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const auth = useAuthContext()

    return auth ? children : <Navigate to="/login" />
}

type Props = {
    setAuth: (authObject: Auth) => void
}

export const Router = ({ setAuth }: Props) => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/logout" element={<Logout setAuth={setAuth} />} />
        <Route
            path="/dashboard"
            element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            }
        />
        <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
)
