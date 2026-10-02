import type { RequestHandler } from 'express'
import { getImageError, getUploadedFiles, removeTmp } from '../helpers/files'

export const imageUpload: RequestHandler = (req, res, next) => {
  const files = getUploadedFiles(req)
  const error = getImageError(files)
  if (error) {
    files.forEach((file) => removeTmp(file.tempFilePath))
    return res.status(400).json({ message: error })
  }
  next()
}
