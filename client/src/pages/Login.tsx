import * as React from 'react'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { getErrorMessage } from 'shared/error'
import { Auth } from 'utils/types'

type Props = {
    setAuth: (authObject: Auth) => void
}

export const Login = ({ setAuth }: Props) => {
    const usernameRef = React.useRef<HTMLInputElement>(null)
    const passwordRef = React.useRef<HTMLInputElement>(null)
    const [requestError, setRequestError] = React.useState('')
    const navigate = useNavigate()

    const onClick = async (mode: 'login' | 'register') => {
        const username = usernameRef.current?.value
        const password = passwordRef.current?.value

        setRequestError('')

        try {
            const {
                data: { user, token },
            } = await axios.post<NonNullable<Auth>>(`${process.env.API_URL}/auth/${mode}`, {
                username,
                password,
            })

            setAuth({ user, token })
            navigate(user.type === 'manager' ? '/admin/bikes' : '/dashboard')
        } catch (error) {
            setRequestError(getErrorMessage(error))
        }
    }

    return (
        <Box>
            <Typography variant="h2">Login</Typography>
            <Box>
                <Stack spacing={2}>
                    <TextField
                        error={Boolean(requestError)}
                        required
                        fullWidth
                        label="Username"
                        name="username"
                        inputRef={usernameRef}
                    />
                    <TextField
                        error={Boolean(requestError)}
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        inputRef={passwordRef}
                    />
                    {requestError && <Alert severity="error">{requestError}</Alert>}
                    <Button fullWidth variant="contained" onClick={() => onClick('login')}>
                        Login
                    </Button>
                    <Button fullWidth variant="contained" onClick={() => onClick('register')}>
                        Register
                    </Button>
                </Stack>
            </Box>
        </Box>
    )
}
