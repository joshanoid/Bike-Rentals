import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'

import { db } from './utils/db'
import usersRoute from './routes/users'
import userRoute from './routes/user'

dotenv.config()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(usersRoute)
app.use(userRoute)

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
