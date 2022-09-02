import { model, Schema } from 'mongoose'
import * as uniqueValidator from 'mongoose-unique-validator'
import * as bcrypt from 'bcrypt'

import { User } from 'shared/types'

const userSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        default: 'user',
    },
})

userSchema.plugin(uniqueValidator, { message: 'is already taken.' })

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10)
    }
    next()
})

export default model<User>('User', userSchema)
