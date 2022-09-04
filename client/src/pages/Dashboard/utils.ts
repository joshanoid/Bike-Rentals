import { eachDayOfInterval, isEqual, isWithinInterval, startOfDay } from 'date-fns'

import { DateRange, Rating, Reservation } from 'shared/types'
import { calculateRating } from 'utils/rating'

import { ExtendedBike } from './types'

type Action =
    | {
          type: 'initialize'
          payload: {
              bikes: ReadonlyArray<ExtendedBike>
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
    | {
          type: 'updateBike'
          payload: { id: string; updatedBike: ExtendedBike; username: string }
      }

const initializeBike = (bike: ExtendedBike, username: string) => ({
    ...bike,
    averageRating: calculateRating(bike.ratings),
    canRate: bike.ratings.length === 0 || !bike.ratings.some((rating) => username === rating.username),
    reservations: bike.reservations.map((reservation) => ({
        ...reservation,
        from: startOfDay(new Date(reservation.from)),
        to: startOfDay(new Date(reservation.to)),
    })),
})

const initialize = (bikes: ReadonlyArray<ExtendedBike>, username: string) =>
    bikes.map((bike) => initializeBike(bike, username))

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

export const isDateRangeAvailable = (dateRange: DateRange, reservations: ReadonlyArray<Reservation>) => {
    const [from, to] = dateRange

    if (reservations.length === 0 || !from || !to) {
        return true
    }

    return !eachDayOfInterval({ start: from, end: to }).every((date) =>
        reservations.some((reservation) =>
            isWithinInterval(date, {
                start: reservation.from,
                end: reservation.to,
            }),
        ),
    )
}

export const getReservationByDateRange = (
    dateRange: DateRange,
    reservations: ReadonlyArray<Reservation>,
    username: string,
) => {
    const [from, to] = dateRange

    if (reservations.length === 0 || !from || !to) {
        return undefined
    }

    return reservations.find(
        (reservation) =>
            isEqual(from, reservation.from) && isEqual(to, reservation.to) && username === reservation.username,
    )
}

const filter = (bikes: ReadonlyArray<ExtendedBike>, _dateRangeIgnored: DateRange) => bikes
// bikes.filter((bike) => isDateRangeAvailable(dateRange, bike.reservations))

const updateBike = (
    bikes: ReadonlyArray<ExtendedBike>,
    payload: { id: string; updatedBike: ExtendedBike; username: string },
) => {
    const { id, updatedBike, username } = payload
    const index = bikes.findIndex((bike) => bike._id === id)
    const bike = bikes[index]

    if (bike) {
        return [...bikes.slice(0, index), initializeBike(updatedBike, username), ...bikes.slice(index + 1)]
    }

    return bikes
}

export const bikesReducer = (state: ReadonlyArray<ExtendedBike>, action: Action): ReadonlyArray<ExtendedBike> => {
    switch (action.type) {
        case 'initialize':
            return initialize(action.payload.bikes, action.payload.username)
        case 'updateRating':
            return updateRating(state, action.payload)
        case 'filter':
            return filter(state, action.payload.dateRange)
        case 'updateBike':
            return updateBike(state, action.payload)
        default:
            return state
    }
}
