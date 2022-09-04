import * as express from 'express'

import { authenticateJWTToken, decodeJWTToken } from 'utils/auth'
import BikeModel from 'models/bike'
import { DateRange } from 'shared/types'

const router: express.Router = express.Router()

router
    .post('/reserve', authenticateJWTToken, async (req: express.Request, res: express.Response) => {
        const { id, dateRange } = req.body as { id: string; dateRange: DateRange }
        const [from, to] = dateRange
        const user = decodeJWTToken(req)

        if (!user) {
            return res.status(401).send('Unauthorized')
        }

        if (id && from && to) {
            const result = await BikeModel.findByIdAndUpdate(
                id,
                {
                    $push: { reservations: { username: user.username, from, to } },
                },
                { new: true },
            )

            return res.status(200).json(result)
        }

        return res.status(500).send('Reservation failed')
    })
    .delete(
        '/reserve/:bikeid/:reservationid',
        authenticateJWTToken,
        async (req: express.Request, res: express.Response) => {
            const { bikeid, reservationid } = req.params
            const user = decodeJWTToken(req)

            if (!user) {
                return res.status(401).send('Unauthorized')
            }

            const result = await BikeModel.findByIdAndUpdate(
                bikeid,
                {
                    $pull: { reservations: { _id: reservationid } },
                },
                { new: true },
            )

            return res.status(200).json(result)
        },
    )

export default router
