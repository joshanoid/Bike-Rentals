import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

import { User } from 'shared/types'

export const generateAccessToken = ({ username, type }: User) =>
    jwt.sign({ username, type }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' })

export const authenticateJWTToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (token) {
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, {}, (error) => {
            if (error) {
                res.status(403).send('Unauthorized')
            } else {
                next()
            }
        })
    } else {
        res.status(401).send('Unauthorized')
    }
}

export const authenticateManagerJWTToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (token) {
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, {}, (error, verifiedToken) => {
            if (error || (verifiedToken as User).type === 'user') {
                res.status(403).send('Unauthorized')
            } else {
                next()
            }
        })
    } else {
        res.status(401).send('Unauthorized')
    }
}

export const decodeJWTToken = (req: Request) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET) as User

        return decoded
    }

    return undefined
}
