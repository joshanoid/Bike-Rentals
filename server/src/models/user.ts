import { Document, model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'

import { User } from 'shared/types'

type UserDocument = User & Document

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
    if (!this.isModified('password')) {
        return next()
    }
    this.password = bcrypt.hashSync(this.password, 10)
    next()
})

export default model<UserDocument, User>('User', userSchema)
