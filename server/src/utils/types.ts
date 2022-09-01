import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

export type TokenRequest = Request & { token: string | JwtPayload | undefined }
