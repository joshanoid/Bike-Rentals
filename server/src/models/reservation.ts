import { model, Schema } from 'mongoose'

import { Reservation } from 'shared/types'

export const reservationSchema = new Schema<Reservation>({
    username: {
        type: String,
        required: true,
    },
    from: {
        type: Date,
        required: true,
    },
    to: {
        type: Date,
        required: true,
    },
})

export default model<Reservation>('Reservation', reservationSchema)
