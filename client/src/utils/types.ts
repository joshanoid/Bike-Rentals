import { User } from 'shared/types'

export type Auth =
    | {
          user: User
          token: string
      }
    | undefined
