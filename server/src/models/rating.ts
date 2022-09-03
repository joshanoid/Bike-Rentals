import { model, Schema } from 'mongoose'

import { Rating } from 'shared/types'

export const ratingSchema = new Schema<Rating>({
    username: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
})

export default model<Rating>('Rating', ratingSchema)
