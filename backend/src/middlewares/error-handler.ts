import { ErrorRequestHandler } from 'express'
import multer from 'multer'

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof multer.MulterError) {
        const message =
            err.code === 'LIMIT_FILE_SIZE'
                ? 'Файл слишком большой'
                : 'Ошибка загрузки файла'

        res.status(400).send({ message })
        return
    }

    const statusCode = err.statusCode || 500
    const message =
        statusCode === 500 ? 'На сервере произошла ошибка' : err.message

    res.status(statusCode).send({ message })
}

export default errorHandler