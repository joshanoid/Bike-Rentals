import { User } from 'shared/types'

export const getAuthData = () => {
    const token = localStorage.getItem('token')
    const user: User = JSON.parse(localStorage.getItem('user') ?? '{}')

    return { user, token }
}

export const setAuthData = (user: User, token: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
}

export const clearAuthData = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
}
