import * as express from 'express'
import * as bcrypt from 'bcrypt'

import { User } from 'shared/types'
import { getErrorMessage } from 'utils/error'
import { generateAccessToken } from 'utils/auth'
import UserModel from 'models/user'

const router: express.Router = express.Router()

router
    .post(
        '/auth/login',
        async (req: express.Request<Record<string, never>, User | string, User>, res: express.Response) => {
            const { username, password } = req.body
            const foundUser = await UserModel.findOne({ username })

            if (foundUser) {
                const isMatch = bcrypt.compareSync(password, foundUser.password)

                if (isMatch) {
                    const token = generateAccessToken(foundUser)

                    res.status(200).send({ user: { username, type: foundUser.type }, token })
                } else {
                    res.status(401).send(getErrorMessage('Password is not correct'))
                }
            } else {
                res.status(401).send(getErrorMessage('User not found'))
            }
        },
    )
    .post(
        '/auth/register',
        async (req: express.Request<Record<string, never>, User | string, User>, res: express.Response) => {
            try {
                await UserModel.create(req.body)

                res.status(200).send('Registration was successful')
            } catch (error) {
                res.status(401).send(getErrorMessage(error))
            }
        },
    )

export default router
