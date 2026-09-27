import crypto from 'crypto'
import { Request, Response, NextFunction } from 'express'
import { doubleCsrf } from 'csrf-csrf'

const CSRF_SESSION_COOKIE = 'csrf-session'

const ensureCsrfSession = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.cookies[CSRF_SESSION_COOKIE]) {
        const sessionId = crypto.randomBytes(32).toString('hex')

        res.cookie(CSRF_SESSION_COOKIE, sessionId, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/',
        })

        req.cookies[CSRF_SESSION_COOKIE] = sessionId
    }

    next()
}

const {
    generateCsrfToken,
    doubleCsrfProtection,
} = doubleCsrf({
    getSecret: () =>
        process.env.CSRF_SECRET || 'csrf-secret-dev-change-me',

    getSessionIdentifier: (req) =>
        req.cookies[CSRF_SESSION_COOKIE],

    cookieName: 'x-csrf-token',

    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
    },

    getCsrfTokenFromRequest: (req) =>
        req.headers['x-csrf-token'] as string,
})

export {
    ensureCsrfSession,
    generateCsrfToken,
    doubleCsrfProtection,
}