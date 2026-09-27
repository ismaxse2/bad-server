import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import {
    doubleCsrfProtection,
    ensureCsrfSession,
} from './middlewares/csrf'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()

app.set('trust proxy', 1)

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}

app.use(cookieParser())

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(ensureCsrfSession)

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true, limit: '100kb' }))
app.use(json({ limit: '100kb' }))

app.use(doubleCsrfProtection)

const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 40,
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(limiter)

app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console
const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()