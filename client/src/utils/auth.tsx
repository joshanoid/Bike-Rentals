import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import * as React from 'react'

import { Auth } from './types'

const AuthContext = React.createContext<Auth>(undefined)

type Props = {
    children: React.ReactNode
    auth: Auth
}

export const AuthProvider = ({ children, auth }: Props) => (
    <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
)

export const useAuthContext = () => React.useContext(AuthContext)

export const useAuth = (): [Auth, (authObject: Auth) => void] => {
    const getAuth = (): Auth => {
        const auth = localStorage.getItem('auth')

        if (auth) {
            return JSON.parse(auth)
        }

        return undefined
    }

    const [auth, setAuth] = React.useState<Auth>(getAuth())

    const saveAuth = (authObject: Auth) => {
        if (authObject) {
            localStorage.setItem('auth', JSON.stringify(authObject))
        } else {
            localStorage.removeItem('auth')
        }

        setAuth(authObject)
    }

    return [auth, saveAuth]
}

export const useAuthApi = () => {
    const auth = useAuthContext()
    const navigate = useNavigate()

    const instance = axios.create({
        baseURL: process.env.API_URL,
        headers: { Authorization: `Bearer ${auth?.token}` },
    })

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (axios.isAxiosError(error)) {
                const { response } = error

                if (response?.status === 403) {
                    return navigate('/logout')
                }
            }

            return Promise.reject(error)
        },
    )

    return instance
}
