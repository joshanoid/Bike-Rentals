import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as cors from 'cors'

import { db } from './utils/db'
import usersRoute from './routes/users'
import authRoute from './routes/auth'
import bikesRoute from './routes/bikes'
import rateRoute from './routes/rate'

dotenv.config()

const app = express()

app.use(
    cors({
        origin: ['http://localhost:8080'],
    }),
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(usersRoute)
app.use(authRoute)
app.use(bikesRoute)
app.use(rateRoute)

const start = async () => {
    try {
        await db.connect()

        app.listen(3000, () => console.log('Server started on port 3000'))
    } catch (error) {
        console.error(error)

        process.exit(1)
    }
}

void start()
