import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

import { TokenRequest } from './types'

export const generateAccessToken = (username: string) =>
    jwt.sign(username, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' })

export const authenticateJWTToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (token) {
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, {}, (error, verifiedToken) => {
            console.log(error)

            if (error) {
                res.sendStatus(403)
            } else {
                // eslint-disable-next-line functional/immutable-data
                ;(req as TokenRequest).token = verifiedToken

                next()
            }
        })
    } else {
        res.sendStatus(401)
    }
}
