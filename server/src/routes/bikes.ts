import * as express from 'express'

import { authenticateJWTToken, authenticateManagerJWTToken } from 'utils/auth'
import BikeModel from 'models/bike'
import { getErrorMessage } from 'shared/error'
import { Bike } from 'shared/types'

const router: express.Router = express.Router()

router
    .get('/bikes', authenticateJWTToken, async (_req: express.Request, res: express.Response) => {
        const bikes = await BikeModel.find()

        res.status(200).json(bikes)
    })
    .post('/bikes', authenticateManagerJWTToken, async (req: express.Request, res: express.Response) => {
        try {
            const { model, color, location } = req.body as Bike
            const newBike = new BikeModel({ model, color, location })

            const insertedBike = await newBike.save()

            res.status(201).json(insertedBike)
        } catch (error) {
            res.status(400).json({ message: getErrorMessage(error) })
        }
    })
    .put('/bikes/:id', authenticateManagerJWTToken, async (req: express.Request, res: express.Response) => {
        const { id } = req.params
        const { model, color, location } = req.body

        await BikeModel.findByIdAndUpdate(id, { model, color, location })

        const updatedBike = await BikeModel.findById(id)

        res.status(200).json(updatedBike)
    })
    .delete('/bikes/:id', authenticateManagerJWTToken, async (req: express.Request, res: express.Response) => {
        const { id } = req.params
        const deletedBike = await BikeModel.findByIdAndDelete(id)

        res.status(200).json(deletedBike)
    })

export default router
