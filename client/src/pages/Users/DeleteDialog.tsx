import * as React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material'

import { User } from 'shared/types'
import { getErrorMessage } from 'shared/error'
import { useAuthApi } from 'utils/auth'

import { DialogState } from './types'

export const DeleteDialog = ({ user, dispatch, open, setOpen, setSnackbarState }: DialogState) => {
    const authApi = useAuthApi()
    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmit = async () => {
        try {
            await authApi.delete<User>(`/users/${user?.username}`)

            dispatch({ type: 'deleteUser', payload: user?._id ?? '' })

            setSnackbarState({
                open: true,
                type: 'success',
                message: 'User successfully deleted',
            })
        } catch (error) {
            setSnackbarState({
                open: true,
                type: 'error',
                message: getErrorMessage(error),
            })
        }

        setOpen(false)
    }

    return open ? (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete User</DialogTitle>
            <DialogContent>
                <DialogContentText>Are you sure you want to delete {user?.username}?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Delete</Button>
            </DialogActions>
        </Dialog>
    ) : null
}
