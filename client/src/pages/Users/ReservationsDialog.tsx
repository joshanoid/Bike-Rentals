import * as React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    DialogContentText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'

import { Bike } from 'shared/types'
import { useAuthApi } from 'utils/auth'

import { DialogState } from './types'

type Reservations = ReadonlyArray<{
    id: string
    model: string
    from: Date
    to: Date
}>

export const ReservationsDialog = ({ user, open, setOpen }: Omit<DialogState, 'dispatch' | 'setSnackbarState'>) => {
    const authApi = useAuthApi()
    const [reservations, setReservations] = React.useState<Reservations>([])

    React.useEffect(() => {
        const fetchReservations = async () => {
            const response = await authApi.get<ReadonlyArray<Bike>>('/bikes')

            setReservations(
                response.data.flatMap((bike) =>
                    bike.reservations
                        .filter((reservation) => reservation.username === user?.username)
                        .map((reservation) => ({
                            id: reservation._id ?? '',
                            model: bike.model,
                            from: reservation.from,
                            to: reservation.to,
                        })),
                ),
            )
        }

        void fetchReservations()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClose = () => {
        setOpen(false)
    }

    return open ? (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete User</DialogTitle>
            <DialogContent>
                <DialogContentText>Reserved Bikes</DialogContentText>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Model</TableCell>
                                <TableCell align="right">From</TableCell>
                                <TableCell align="right">To</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reservations.map((reservation) => (
                                <TableRow key={reservation.id}>
                                    <TableCell component="th" scope="row">
                                        {reservation.model}
                                    </TableCell>
                                    <TableCell align="right">{reservation.from.toString()}</TableCell>
                                    <TableCell align="right">{reservation.to.toString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    ) : null
}
