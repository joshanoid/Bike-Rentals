import * as React from 'react'
import {
    Alert,
    Box,
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
import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker'

import { useAuthApi, useAuthContext } from 'utils/auth'
import { getErrorMessage } from 'shared/error'
import { Rating as RatingType } from 'shared/types'

import { bikesReducer, defaultFilters, filterBikes } from './utils'
import { ExtendedBike, Filters as FiltersType, SnackbarState } from './types'
import { Reservation } from './Reservation'
import { Filters } from './Filters'

export const Dashboard = () => {
    const auth = useAuthContext()
    const authApi = useAuthApi()
    const [bikes, dispatch] = React.useReducer(bikesReducer, [])
    const [snackbarState, setSnackbarState] = React.useState<SnackbarState>({ open: false })
    const [dateRange, setDateRange] = React.useState<DateRange<Date>>([null, null])
    const [filters, setFilters] = React.useState<FiltersType>(defaultFilters)

    const filteredBikes = React.useMemo(() => filterBikes(bikes, filters), [bikes, filters])

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
        <Box>
            <Typography variant="h2">Bikes</Typography>
            <Stack direction="row">
                <Filters
                    filters={filters}
                    setFilters={setFilters}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    bikes={bikes}
                />
            </Stack>
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
                        {filteredBikes.map((bike) => (
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
                                    <Reservation
                                        bike={bike}
                                        dateRange={dateRange}
                                        dispatch={dispatch}
                                        setSnackbarState={setSnackbarState}
                                    />
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
    )
}
