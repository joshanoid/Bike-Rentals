import mongoose from 'mongoose'

import UserModel from 'models/user'

const connectionString = 'mongodb://localhost:27017/reactbikes?authSource=admin'

mongoose.set('debug', process.env.NODE_ENV !== 'production')

export const db = {
    connect: () => mongoose.connect(connectionString),
    disconnect: () => mongoose.connection.close(),
    addAdminUserIfNotExist: async () => {
        const user = await UserModel.findOne({ username: 'admin' })

        if (!user) {
            const adminUser = new UserModel({ username: 'admin', password: 'admin', type: 'manager' })

            await adminUser.save()
        }
    },
}
