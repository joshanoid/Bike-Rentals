import * as React from 'react'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios'

import { getErrorMessage } from 'shared/error'
import { setAuthData } from 'utils/auth'
import { User } from 'shared/types'

export const Login = () => {
    const usernameRef = React.useRef<HTMLInputElement>(null)
    const passwordRef = React.useRef<HTMLInputElement>(null)
    const [requestError, setRequestError] = React.useState('')

    const onClick = async (mode: 'login' | 'register') => {
        const username = usernameRef.current?.value
        const password = passwordRef.current?.value

        setRequestError('')

        try {
            const {
                data: { user, token },
            } = await axios.post<{ user: User; token: string }>(`${process.env.API_URL}/auth/${mode}`, {
                username,
                password,
            })

            setAuthData(user, token)
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
