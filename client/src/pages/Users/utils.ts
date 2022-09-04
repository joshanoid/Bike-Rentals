import { User } from 'shared/types'

type Action =
    | {
          type: 'initialize'
          payload: ReadonlyArray<User>
      }
    | {
          type: 'addUser'
          payload: User
      }
    | {
          type: 'updateUser'
          payload: User
      }
    | {
          type: 'deleteUser'
          payload: string
      }

const updateUser = (state: ReadonlyArray<User>, updatedUser: User) => {
    const index = state.findIndex((user) => user._id === updatedUser._id)

    if (index > -1) {
        return [...state.slice(0, index), updatedUser, ...state.slice(index + 1)]
    }

    return state
}

const deleteUser = (state: ReadonlyArray<User>, userId: string) => {
    const index = state.findIndex((user) => user._id === userId)

    if (index > -1) {
        return [...state.slice(0, index), ...state.slice(index + 1)]
    }

    return state
}

export const usersReducer = (state: ReadonlyArray<User>, action: Action): ReadonlyArray<User> => {
    switch (action.type) {
        case 'initialize':
            return [...action.payload]
        case 'addUser':
            return [...state, action.payload]
        case 'updateUser':
            return updateUser(state, action.payload)
        case 'deleteUser':
            return deleteUser(state, action.payload)
        default:
            return state
    }
}
