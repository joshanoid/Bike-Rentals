import * as express from 'express'

import { authenticateJWTToken, decodeJWTToken } from 'utils/auth'
import BikeModel from 'models/bike'

const router: express.Router = express.Router()

router.post('/rate', authenticateJWTToken, async (req: express.Request, res: express.Response) => {
    const { id, rating } = req.body
    const user = decodeJWTToken(req)

    if (!user) {
        return res.status(401).send('Unauthorized')
    }

    if (id && rating) {
        const rated = await BikeModel.findOne({ _id: id, ratings: { $elemMatch: { username: user.username } } })

        if (rated) {
            return res.status(500).send('Rate failed')
        }

        const result = await BikeModel.updateOne(
            { _id: id },
            { $push: { ratings: { username: user.username, value: rating } } },
        )

        if (result.modifiedCount) {
            return res.status(200).send('Rate added')
        }
    }

    return res.status(500).send('Rate failed')
})

export default router
