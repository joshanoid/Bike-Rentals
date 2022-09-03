import * as React from 'react'
import { Navigate } from 'react-router-dom'

import { Auth } from 'utils/types'

type Props = {
    setAuth: (authObject?: Auth) => void
}

export const Logout = ({ setAuth }: Props) => {
    React.useEffect(() => {
        setAuth()
    }, [setAuth])

    return <Navigate to="/login" />
}
