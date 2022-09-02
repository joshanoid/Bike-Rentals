import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

import { User } from 'shared/types'

import { TokenRequest } from './types'

export const generateAccessToken = ({ username, type }: User) =>
    jwt.sign({ username, type }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' })

export const authenticateJWTToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (token) {
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, {}, (error, verifiedToken) => {
            if (error) {
                res.status(403).send('Unauthorized')
            } else {
                // eslint-disable-next-line functional/immutable-data
                ;(req as TokenRequest).token = verifiedToken

                next()
            }
        })
    } else {
        res.status(401).send('Unauthorized')
    }
}
