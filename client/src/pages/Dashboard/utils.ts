import { eachDayOfInterval, isWithinInterval } from 'date-fns'

import { Bike, Rating, Reservation } from 'shared/types'
import { calculateRating } from 'utils/rating'

import { DateRange, ExtendedBike } from './types'

type Action =
    | {
          type: 'initialize'
          payload: {
              bikes: ReadonlyArray<Bike & { _id: string }>
              username: string
          }
      }
    | {
          type: 'updateRating'
          payload: { id: string; rating: Rating['value']; username: string }
      }
    | {
          type: 'filter'
          payload: { dateRange: DateRange }
      }

const initialize = (bikes: ReadonlyArray<Bike & { _id: string }>, username: string) =>
    bikes.map((bike) => ({
        ...bike,
        averageRating: calculateRating(bike.ratings),
        canRate: bike.ratings.length === 0 || !bike.ratings.some((rating) => username === rating.username),
    }))

const updateRating = (
    state: ReadonlyArray<ExtendedBike>,
    payload: { id: string; rating: Rating['value']; username: string },
) => {
    const { id, rating, username } = payload
    const index = state.findIndex((bike) => bike._id === id)
    const updateableBike = state[index]

    if (updateableBike) {
        const updatedRatings = [...updateableBike.ratings, { username, value: rating }]
        const updatedBike = {
            ...updateableBike,
            ratings: updatedRatings,
            canRate: false,
            averageRating: calculateRating(updatedRatings),
        }

        return [...state.slice(0, index), updatedBike, ...state.slice(index + 1)]
    }

    return state
}

export const isDateRangeAvailable = (
    dateRange: [Date | null, Date | null],
    reservations: ReadonlyArray<Reservation>,
) => {
    const [from, to] = dateRange

    if (reservations.length === 0 || !from || !to) {
        return true
    }

    return eachDayOfInterval({ start: from, end: to }).every((date) =>
        reservations.some((reservation) =>
            isWithinInterval(date, {
                start: reservation.from,
                end: reservation.to,
            }),
        ),
    )
}

const filter = (bikes: ReadonlyArray<ExtendedBike>, dateRange: DateRange) =>
    bikes.filter((bike) => isDateRangeAvailable(dateRange, bike.reservations))

export const bikesReducer = (state: ReadonlyArray<ExtendedBike>, action: Action): ReadonlyArray<ExtendedBike> => {
    switch (action.type) {
        case 'initialize':
            return initialize(action.payload.bikes, action.payload.username)
        case 'updateRating':
            return updateRating(state, action.payload)
        case 'filter':
            return filter(state, action.payload.dateRange)
    }
}
