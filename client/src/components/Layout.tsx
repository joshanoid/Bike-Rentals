import { Box, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import * as React from 'react'

type Props = {
    children: React.ReactNode
}

export const Layout = ({ children }: Props) => (
    <Box>
        <Stack direction="column">
            <Box>
                <Typography variant="h1" align="center">
                    React Bike Rental
                </Typography>
            </Box>
            <Stack padding={2} direction="row" spacing={1} justifyContent="center">
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
            </Stack>
            <Box padding={2}>{children}</Box>
        </Stack>
    </Box>
)
