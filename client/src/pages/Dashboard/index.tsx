import * as React from 'react'
import {
    Alert,
    Box,
    Rating,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers-pro'
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns'
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro/DateRangePicker'

import { useAuthApi, useAuthContext } from 'utils/auth'
import { getErrorMessage } from 'shared/error'
import { Rating as RatingType } from 'shared/types'

import { bikesReducer, isDateRangeAvailable } from './utils'
import { ExtendedBike } from './types'

type SnackbarState = {
    open: boolean
    message?: string
    type?: 'error' | 'success'
}

export const Dashboard = () => {
    const auth = useAuthContext()
    const authApi = useAuthApi()
    const [bikes, dispatch] = React.useReducer(bikesReducer, [])
    const [snackbarState, setSnackbarState] = React.useState<SnackbarState>({ open: false })
    const [dateRange, setDateRange] = React.useState<DateRange<Date>>([null, null])

    React.useEffect(() => {
        const fetchBikes = async () => {
            const fetchedBikes = await authApi.get<ReadonlyArray<ExtendedBike>>('/bikes')

            dispatch({
                type: 'initialize',
                payload: {
                    bikes: fetchedBikes.data,
                    username: auth?.user.username ?? '',
                },
            })
        }

        void fetchBikes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onRate = async (id: string, rating: RatingType['value']) => {
        try {
            const response = await authApi.post('/rate', { id, rating })

            dispatch({ type: 'updateRating', payload: { id, rating, username: auth?.user.username ?? '' } })

            setSnackbarState({
                open: true,
                type: 'success',
                message: response.data,
            })
        } catch (error) {
            setSnackbarState({
                open: true,
                type: 'error',
                message: getErrorMessage(error),
            })
        }
    }

    const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setSnackbarState({ open: false })
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} localeText={{ start: 'From', end: 'To' }}>
            <Box>
                <Typography variant="h2">Bikes</Typography>
                <DateRangePicker
                    disablePast
                    value={dateRange}
                    onChange={(newValue) => {
                        setDateRange(newValue)
                        dispatch({ type: 'filter', payload: { dateRange: newValue } })
                    }}
                    renderInput={(startProps, endProps) => (
                        <>
                            <TextField {...startProps} />
                            <Box sx={{ mx: 2 }}> to </Box>
                            <TextField {...endProps} />
                        </>
                    )}
                />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Model</TableCell>
                                <TableCell align="right">Color</TableCell>
                                <TableCell align="right">Location</TableCell>
                                <TableCell align="right">Rating</TableCell>
                                <TableCell align="right">Reservation</TableCell>
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
                                        <Rating
                                            value={bike.canRate ? null : bike.averageRating}
                                            readOnly={!bike.canRate}
                                            onChange={(_event, value) =>
                                                value ? onRate(bike._id, value as RatingType['value']) : null
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {isDateRangeAvailable(dateRange, bike.reservations) ? 'Yeah' : 'No'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Snackbar open={snackbarState.open} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbarState.type} sx={{ width: '100%' }}>
                        {snackbarState.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    )
}
