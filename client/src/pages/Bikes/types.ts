import * as React from 'react'

import { Bike } from 'shared/types'
import { Mode, SnackbarState } from 'utils/types'

import { bikesReducer } from './utils'

export type DialogState = {
    mode?: Mode
    bike?: Bike
    dispatch: React.Dispatch<Parameters<typeof bikesReducer>[1]>
    open: boolean
    setOpen: (value: boolean) => void
    setSnackbarState: React.Dispatch<React.SetStateAction<SnackbarState>>
}
