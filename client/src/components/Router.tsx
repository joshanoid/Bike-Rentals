import * as React from 'react'
import { Routes, Route } from 'react-router-dom'

import { Home } from 'pages/Home'
import { Login } from 'pages/Login'

export const Router = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
    </Routes>
)
