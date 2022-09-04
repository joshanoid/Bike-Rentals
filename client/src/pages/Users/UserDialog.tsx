import * as React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material'

import { User } from 'shared/types'
import { getErrorMessage } from 'shared/error'
import { useAuthApi } from 'utils/auth'

import { DialogState } from './types'

export const UserDialog = ({ mode, user, dispatch, open, setOpen, setSnackbarState }: DialogState) => {
    const authApi = useAuthApi()
    const [username, setUsername] = React.useState<User['username'] | undefined>(user?.username)
    const [password, setPassword] = React.useState<User['password']>('')
    const [userType, setUserType] = React.useState<User['type'] | ''>(user?.type ?? '')

    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmit = async () => {
        if (mode === 'add') {
            try {
                const response = await authApi.post<User>('/users', { username, password, type: userType })

                dispatch({ type: 'addUser', payload: response.data })

                setSnackbarState({
                    open: true,
                    type: 'success',
                    message: 'User successfully added',
                })
            } catch (error) {
                setSnackbarState({
                    open: true,
                    type: 'error',
                    message: getErrorMessage(error),
                })
            }
        } else {
            try {
                const response = await authApi.put<User>(`/users/${user?.username}`, {
                    username,
                    password,
                    type: userType,
                })

                dispatch({ type: 'updateUser', payload: response.data })

                setSnackbarState({
                    open: true,
                    type: 'success',
                    message: 'User successfully updated',
                })
            } catch (error) {
                setSnackbarState({
                    open: true,
                    type: 'error',
                    message: getErrorMessage(error),
                })
            }
        }

        setOpen(false)
    }

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handleUserTypeChange = (event: SelectChangeEvent<User['type']>) => {
        setUserType(event.target.value as User['type'])
    }

    return open ? (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{mode === 'add' ? 'Add new ' : 'Edit '}User</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 4 }}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={handleUsernameChange}
                        disabled={mode === 'edit'}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 4 }}>
                    <TextField
                        label="Password"
                        variant="outlined"
                        value={password}
                        onChange={handlePasswordChange}
                        type="password"
                    />
                </FormControl>
                <FormControl sx={{ minWidth: 120, mt: 4 }}>
                    <Typography variant="subtitle1">Type</Typography>
                    <Select value={userType} onChange={handleUserTypeChange}>
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="manager">Manager</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>{mode === 'add' ? 'Add' : 'Update'}</Button>
            </DialogActions>
        </Dialog>
    ) : null
}
