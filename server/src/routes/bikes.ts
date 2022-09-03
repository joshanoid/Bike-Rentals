import * as express from 'express'

import { authenticateJWTToken } from 'utils/auth'
import BikeModel from 'models/bike'

const router: express.Router = express.Router()

router.get('/bikes', authenticateJWTToken, async (_req: express.Request, res: express.Response) => {
    const bikes = await BikeModel.find()

    res.status(200).json(bikes)
})

export default router
