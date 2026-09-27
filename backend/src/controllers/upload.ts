import { unlinkSync } from 'fs'
import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import sharp from 'sharp'

import BadRequestError from '../errors/bad-request-error'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    if (req.file.size < 2 * 1024) {
        unlinkSync(req.file.path)
        return next(new BadRequestError('Размер файла слишком мал'))
    }
    try {
        const metadata = await sharp(req.file.path).metadata()

        if (!metadata.width || !metadata.height) {
            unlinkSync(req.file.path)
            return next(new BadRequestError('Некорректный файл изображения'))
        }
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        if (req.file) {
            try {
                unlinkSync(req.file.path)
            } catch {
                // файл уже удален
            }
        }

        return next(new BadRequestError('Некорректный файл изображения'))
    }
}

export default {}
