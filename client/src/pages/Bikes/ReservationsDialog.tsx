import * as React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'

import { DialogState } from './types'

export const ReservationsDialog = ({ bike, open, setOpen }: Omit<DialogState, 'dispatch' | 'setSnackbarState'>) => {
    const handleClose = () => {
        setOpen(false)
    }

    return open ? (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>User Reservations</DialogTitle>
            <DialogContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell align="right">From</TableCell>
                                <TableCell align="right">To</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bike?.reservations.map((reservation) => (
                                <TableRow key={reservation._id}>
                                    <TableCell component="th" scope="row">
                                        {reservation.username}
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
