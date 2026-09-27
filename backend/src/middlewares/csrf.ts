import { doubleCsrf } from 'csrf-csrf'

const {
    generateCsrfToken,
    doubleCsrfProtection,
} = doubleCsrf({
    getSecret: () =>
        process.env.CSRF_SECRET || 'csrf-secret-dev-change-me',

    getSessionIdentifier: () => 'weblarek-anonymous',

    cookieName: '_csrf',

    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
    },

    getCsrfTokenFromRequest: (req) =>
        req.headers['x-csrf-token'] as string,
})

const ensureCsrfSession = (
    _req: unknown,
    _res: unknown,
    next: () => void
) => {
    next()
}

export {
    ensureCsrfSession,
    generateCsrfToken,
    doubleCsrfProtection,
}