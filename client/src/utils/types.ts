import { User } from 'shared/types'

export type Auth =
    | {
          user: User
          token: string
      }
    | undefined

export type SnackbarState = {
    open: boolean
    message?: string
    type?: 'error' | 'success'
}
