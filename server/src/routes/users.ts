import * as express from 'express'

import { getErrorMessage } from 'shared/error'
import { authenticateManagerJWTToken } from 'utils/auth'
import UserModel from 'models/user'

const router: express.Router = express.Router()

router
    .get('/users', authenticateManagerJWTToken, async (_req: express.Request, res: express.Response) => {
        const users = await UserModel.find()

        res.status(200).json(users)
    })
    .get('/users/:username', authenticateManagerJWTToken, async (req: express.Request, res: express.Response) => {
        const { username } = req.params
        const user = await UserModel.findOne({ username })

        res.status(200).json(user)
    })
    .post('/users', authenticateManagerJWTToken, async (req: express.Request, res: express.Response) => {
        try {
            const newUser = new UserModel({ ...req.body })

            const insertedUser = await newUser.save()

            res.status(201).json(insertedUser)
        } catch (error) {
            res.status(400).json({ message: getErrorMessage(error) })
        }
    })
    .put('/users/:username', authenticateManagerJWTToken, async (req: express.Request, res: express.Response) => {
        const { username } = req.params
        const { password, type } = req.body

        await UserModel.updateOne({ username }, { ...(password ? { password } : {}), ...(type ? { type } : {}) })

        const updatedUser = await UserModel.findOne({ username })

        res.status(200).json(updatedUser)
    })
    .delete('/users/:username', authenticateManagerJWTToken, async (req: express.Request, res: express.Response) => {
        const { username } = req.params
        const deletedUser = await UserModel.findOneAndDelete({ username })

        res.status(200).json(deletedUser)
    })

export default router
