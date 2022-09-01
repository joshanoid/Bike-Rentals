import mongoose from 'mongoose'

const connectionString = 'mongodb://localhost:27017/reactbikes?authSource=admin'

mongoose.set('debug', process.env.NODE_ENV !== 'production')

export const db = {
    connect: () => mongoose.connect(connectionString),
    disconnect: () => mongoose.connection.close(),
}
