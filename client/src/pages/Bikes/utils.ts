import { Bike } from 'shared/types'

type Action =
    | {
          type: 'initialize'
          payload: ReadonlyArray<Bike>
      }
    | {
          type: 'addBike'
          payload: Bike
      }
    | {
          type: 'updateBike'
          payload: Bike
      }
    | {
          type: 'deleteBike'
          payload: string
      }

const updateBike = (state: ReadonlyArray<Bike>, updatedBike: Bike) => {
    const index = state.findIndex((bike) => bike._id === updatedBike._id)

    if (index > -1) {
        return [...state.slice(0, index), updatedBike, ...state.slice(index + 1)]
    }

    return state
}

const deleteBike = (state: ReadonlyArray<Bike>, bikeId: string) => {
    const index = state.findIndex((bike) => bike._id === bikeId)

    if (index > -1) {
        return [...state.slice(0, index), ...state.slice(index + 1)]
    }

    return state
}

export const bikesReducer = (state: ReadonlyArray<Bike>, action: Action): ReadonlyArray<Bike> => {
    switch (action.type) {
        case 'initialize':
            return [...action.payload]
        case 'addBike':
            return [...state, action.payload]
        case 'updateBike':
            return updateBike(state, action.payload)
        case 'deleteBike':
            return deleteBike(state, action.payload)
        default:
            return state
    }
}
