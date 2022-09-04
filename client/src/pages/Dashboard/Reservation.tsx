import * as React from 'react'
import { Button, Typography } from '@mui/material'
import { startOfDay } from 'date-fns'

import { useAuthApi, useAuthContext } from 'utils/auth'
import { getErrorMessage } from 'shared/error'
import { DateRange, Reservation as ReservationType } from 'shared/types'

import { bikesReducer, getReservationByDateRange, isDateRangeAvailable } from './utils'
import { ExtendedBike, SnackbarState } from './types'

type Props = {
    dateRange: DateRange
    bike: ExtendedBike
    dispatch: React.Dispatch<Parameters<typeof bikesReducer>[1]>
    setSnackbarState: React.Dispatch<React.SetStateAction<SnackbarState>>
}

export const Reservation = ({ dateRange, bike, dispatch, setSnackbarState }: Props) => {
    const auth = useAuthContext()
    const authApi = useAuthApi()
    const username = auth?.user.username ?? ''

    const onReserve = async () => {
        const [from, to] = dateRange

        if (from && to) {
            const normalizedDateRange = [startOfDay(from), startOfDay(to)] as DateRange

            try {
                const response = await authApi.post<ExtendedBike>('/reserve', {
                    id: bike._id,
                    dateRange: normalizedDateRange,
                })

                dispatch({ type: 'updateBike', payload: { id: bike._id, updatedBike: response.data, username } })

                setSnackbarState({
                    open: true,
                    type: 'success',
                    message: 'Reservation added',
                })
            } catch (error) {
                setSnackbarState({
                    open: true,
                    type: 'error',
                    message: getErrorMessage(error),
                })
            }
        }
    }

    const onCancelReservation = async (reservation: ReservationType) => {
        try {
            const response = await authApi.delete(`/reserve/${bike._id}/${reservation._id}`)

            dispatch({ type: 'updateBike', payload: { id: bike._id, updatedBike: response.data, username } })

            setSnackbarState({
                open: true,
                type: 'success',
                message: 'Reservation canceled',
            })
        } catch (error) {
            setSnackbarState({
                open: true,
                type: 'error',
                message: getErrorMessage(error),
            })
        }
    }

    if (!(dateRange[0] && dateRange[1])) {
        return <Typography variant="caption">Please select a date range</Typography>
    }

    const reservation = getReservationByDateRange(dateRange, bike.reservations, auth?.user.username ?? '')

    if (reservation) {
        return (
            <Button variant="contained" onClick={() => onCancelReservation(reservation)}>
                Cancel reservation
            </Button>
        )
    }

    if (isDateRangeAvailable(dateRange, bike.reservations)) {
        return (
            <Button variant="contained" onClick={onReserve}>
                Reserve
            </Button>
        )
    }

    return <div>Not available</div>
}
