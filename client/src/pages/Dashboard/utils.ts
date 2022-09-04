import { Bike, Rating } from 'shared/types'
import { calculateRating } from 'utils/rating'

import { ExtendedBike } from './types'

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

export const bikesReducer = (state: ReadonlyArray<ExtendedBike>, action: Action): ReadonlyArray<ExtendedBike> => {
    switch (action.type) {
        case 'initialize':
            return initialize(action.payload.bikes, action.payload.username)
        case 'updateRating':
            return updateRating(state, action.payload)
    }
}
