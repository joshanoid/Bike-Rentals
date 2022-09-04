import { model, Schema } from 'mongoose'
import * as uniqueValidator from 'mongoose-unique-validator'

import { Bike } from 'shared/types'

import { ratingSchema } from './rating'
import { reservationSchema } from './reservation'

const bikeSchema = new Schema<Bike>({
    model: {
        type: String,
        required: true,
        unique: true,
    },
    color: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    ratings: {
        type: [ratingSchema],
        required: true,
        default: [],
    },
    reservations: {
        type: [reservationSchema],
        required: true,
        default: [],
    },
})

bikeSchema.plugin(uniqueValidator, { message: 'already exist.' })

export default model<Bike>('Bike', bikeSchema)
