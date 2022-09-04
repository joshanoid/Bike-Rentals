import * as React from 'react'
import {
    Alert,
    Box,
    Button,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'

import { useAuthApi } from 'utils/auth'
import { SnackbarState } from 'utils/types'
import { User } from 'shared/types'

import { usersReducer } from './utils'
import { UserDialog } from './UserDialog'
import { DialogState } from './types'
import { DeleteDialog } from './DeleteDialog'
import { ReservationsDialog } from './ReservationsDialog'

export const Users = () => {
    const authApi = useAuthApi()
    const [users, dispatch] = React.useReducer(usersReducer, [])
    const [snackbarState, setSnackbarState] = React.useState<SnackbarState>({ open: false })
    const [dialogState, setDialogState] = React.useState<DialogState>({
        dispatch,
        open: false,
        setOpen: (value: boolean) => {
            setDialogState((oldState) => ({ ...oldState, open: value }))
        },
        setSnackbarState,
    })
    const [deleteDialogState, setDeleteDialogState] = React.useState({
        dispatch,
        open: false,
        setOpen: (value: boolean) => {
            setDeleteDialogState((oldState) => ({ ...oldState, open: value }))
        },
        setSnackbarState,
    })
    const [reservationsDialogState, setReservationsDialogState] = React.useState({
        open: false,
        setOpen: (value: boolean) => {
            setReservationsDialogState((oldState) => ({ ...oldState, open: value }))
        },
    })

    React.useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await authApi.get<ReadonlyArray<User>>('/users')

            dispatch({
                type: 'initialize',
                payload: fetchedUsers.data,
            })
        }

        void fetchUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setSnackbarState({ open: false })
    }

    const onAddUser = () => {
        setDialogState((oldState) => ({ ...oldState, mode: 'add', open: true, user: undefined }))
    }

    const onEdit = (user: User) => {
        setDialogState((oldState) => ({ ...oldState, mode: 'edit', open: true, user }))
    }

    const onDelete = (user: User) => {
        setDeleteDialogState((oldState) => ({ ...oldState, open: true, user }))
    }

    const onListClick = (user: User) => {
        setReservationsDialogState((oldState) => ({ ...oldState, open: true, user }))
    }

    return (
        <Box>
            <Typography variant="h2">Users</Typography>
            <Button variant="contained" onClick={onAddUser}>
                Add new user
            </Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell align="right">Type</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell component="th" scope="row">
                                    {user.username}
                                </TableCell>
                                <TableCell align="right">{user.type}</TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" justifyContent="flex-end">
                                        <Button variant="contained" onClick={() => onEdit(user)}>
                                            Edit
                                        </Button>
                                        <Button variant="contained" onClick={() => onDelete(user)}>
                                            Delete
                                        </Button>
                                        <Button variant="contained" onClick={() => onListClick(user)}>
                                            List Reserved Bikes
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {dialogState.open && <UserDialog {...dialogState} />}
            {deleteDialogState.open && <DeleteDialog {...deleteDialogState} />}
            {reservationsDialogState.open && <ReservationsDialog {...reservationsDialogState} />}
            <Snackbar open={snackbarState.open} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarState.type} sx={{ width: '100%' }}>
                    {snackbarState.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}
