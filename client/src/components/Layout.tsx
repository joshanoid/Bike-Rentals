import * as React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { useAuthContext } from 'utils/auth'

type Props = {
    children: React.ReactNode
}

export const Layout = ({ children }: Props) => {
    const auth = useAuthContext()

    return (
        <Box>
            <Stack direction="column">
                <Box>
                    <Typography variant="h1" align="center">
                        React Bike Rental
                    </Typography>
                </Box>
                <Stack padding={2} direction="row" spacing={1} justifyContent="center">
                    <Link to="/">Home</Link>
                    {auth ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}
                    {auth && <Link to="/dashboard">Dashboard</Link>}
                </Stack>
                <Box padding={2}>{children}</Box>
            </Stack>
        </Box>
    )
}
