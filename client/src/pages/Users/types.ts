import * as React from 'react'

import { User } from 'shared/types'
import { Mode, SnackbarState } from 'utils/types'

import { usersReducer } from './utils'

export type DialogState = {
    mode?: Mode
    user?: User
    dispatch: React.Dispatch<Parameters<typeof usersReducer>[1]>
    open: boolean
    setOpen: (value: boolean) => void
    setSnackbarState: React.Dispatch<React.SetStateAction<SnackbarState>>
}
