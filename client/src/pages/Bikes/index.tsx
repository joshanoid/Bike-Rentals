import * as React from 'react'
import {
    Alert,
    Box,
    Button,
    Rating,
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
import { Bike } from 'shared/types'
import { calculateRating } from 'utils/rating'

import { bikesReducer } from './utils'
import { BikeDialog } from './BikeDialog'
import { DialogState } from './types'
import { DeleteDialog } from './DeleteDialog'
import { ReservationsDialog } from './ReservationsDialog'

export const Bikes = () => {
    const authApi = useAuthApi()
    const [bikes, dispatch] = React.useReducer(bikesReducer, [])
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
        const fetcBikes = async () => {
            const fetchedBikes = await authApi.get<ReadonlyArray<Bike>>('/bikes')

            dispatch({
                type: 'initialize',
                payload: fetchedBikes.data,
            })
        }

        void fetcBikes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setSnackbarState({ open: false })
    }

    const onAddBike = () => {
        setDialogState((oldState) => ({ ...oldState, mode: 'add', open: true, bike: undefined }))
    }

    const onEdit = (bike: Bike) => {
        setDialogState((oldState) => ({ ...oldState, mode: 'edit', open: true, bike }))
    }

    const onDelete = (bike: Bike) => {
        setDeleteDialogState((oldState) => ({ ...oldState, open: true, bike }))
    }

    const onListClick = (bike: Bike) => {
        setReservationsDialogState((oldState) => ({ ...oldState, open: true, bike }))
    }

    return (
        <Box>
            <Typography variant="h2">Bikes</Typography>
            <Button variant="contained" onClick={onAddBike}>
                Add new bike
            </Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Model</TableCell>
                            <TableCell align="right">Color</TableCell>
                            <TableCell align="right">Location</TableCell>
                            <TableCell align="right">Rating</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bikes.map((bike) => (
                            <TableRow key={bike._id}>
                                <TableCell component="th" scope="row">
                                    {bike.model}
                                </TableCell>
                                <TableCell align="right">{bike.color}</TableCell>
                                <TableCell align="right">{bike.location}</TableCell>
                                <TableCell align="right">
                                    <Rating value={calculateRating(bike.ratings)} readOnly />
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" justifyContent="flex-end">
                                        <Button variant="contained" onClick={() => onEdit(bike)}>
                                            Edit
                                        </Button>
                                        <Button variant="contained" onClick={() => onDelete(bike)}>
                                            Delete
                                        </Button>
                                        <Button variant="contained" onClick={() => onListClick(bike)}>
                                            List User Reservations
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {dialogState.open && <BikeDialog {...dialogState} />}
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
