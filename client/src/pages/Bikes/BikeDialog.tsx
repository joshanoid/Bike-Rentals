import * as React from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormControl } from '@mui/material'

import { Bike } from 'shared/types'
import { getErrorMessage } from 'shared/error'
import { useAuthApi } from 'utils/auth'

import { DialogState } from './types'

export const BikeDialog = ({ mode, bike, dispatch, open, setOpen, setSnackbarState }: DialogState) => {
    const authApi = useAuthApi()
    const [model, setModel] = React.useState<Bike['model']>(bike?.model ?? '')
    const [color, setColor] = React.useState<Bike['color']>(bike?.color ?? '')
    const [location, setLocation] = React.useState<Bike['location']>(bike?.location ?? '')

    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmit = async () => {
        if (mode === 'add') {
            try {
                const response = await authApi.post<Bike>('/bikes', {
                    model,
                    color,
                    location,
                })

                dispatch({ type: 'addBike', payload: response.data })

                setSnackbarState({
                    open: true,
                    type: 'success',
                    message: 'Bike successfully added',
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
                const response = await authApi.put<Bike>(`/bikes/${bike?._id}`, {
                    model,
                    color,
                    location,
                })

                dispatch({ type: 'updateBike', payload: response.data })

                setSnackbarState({
                    open: true,
                    type: 'success',
                    message: 'Bike successfully updated',
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

    const handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setModel(event.target.value)
    }

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value)
    }

    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(event.target.value)
    }

    return open ? (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{mode === 'add' ? 'Add new ' : 'Edit '}Bike</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 4 }}>
                    <TextField label="Model" variant="outlined" value={model} onChange={handleModelChange} />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 4 }}>
                    <TextField label="Color" variant="outlined" value={color} onChange={handleColorChange} />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 4 }}>
                    <TextField label="Location" variant="outlined" value={location} onChange={handleLocationChange} />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>{mode === 'add' ? 'Add' : 'Update'}</Button>
            </DialogActions>
        </Dialog>
    ) : null
}
