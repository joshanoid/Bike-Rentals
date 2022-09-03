import * as React from 'react'
import {
    Box,
    Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'

import { useAuthApi, useAuthContext } from 'utils/auth'
import { Bike } from 'shared/types'
import { calculateRating } from 'utils/rating'

type BikeWithId = Bike & { _id: string }

export const Dashboard = () => {
    const auth = useAuthContext()
    const authApi = useAuthApi()
    const [bikes, setBikes] = React.useState<ReadonlyArray<BikeWithId>>([])

    React.useEffect(() => {
        const fetchBikes = async () => {
            const fetchedBikes = await authApi.get<ReadonlyArray<BikeWithId>>('/bikes')

            setBikes(fetchedBikes.data)
        }

        void fetchBikes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box>
            <Typography variant="h2">Bikes</Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Model</TableCell>
                            <TableCell align="right">Color</TableCell>
                            <TableCell align="right">Location</TableCell>
                            <TableCell align="right">Rating</TableCell>
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
                                        value={calculateRating(bike.ratings)}
                                        readOnly={bike.ratings.some(
                                            (rating) => auth?.user.username === rating.username,
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
