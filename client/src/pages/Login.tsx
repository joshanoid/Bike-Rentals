import * as React from 'react'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'

export const Login = () => {
    const usernameRef = React.useRef<HTMLInputElement>(null)
    const passwordRef = React.useRef<HTMLInputElement>(null)

    const onLogin = () => {
        const username = usernameRef.current?.value
        const password = passwordRef.current?.value

        console.log(username, password)
    }

    const onRegister = () => {
        const username = usernameRef.current?.value
        const password = passwordRef.current?.value

        console.log(username, password)
    }

    return (
        <Box>
            <Typography variant="h2">Login</Typography>
            <Box>
                <Stack spacing={2}>
                    <TextField required fullWidth label="Username" name="username" inputRef={usernameRef} />
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        inputRef={passwordRef}
                    />
                    <Button fullWidth variant="contained" onClick={onLogin}>
                        Login
                    </Button>
                    <Button fullWidth variant="contained" onClick={onRegister}>
                        Register
                    </Button>
                </Stack>
            </Box>
        </Box>
    )
}
