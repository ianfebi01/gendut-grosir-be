import type { Request, Response } from 'express'
import cloudinary from 'cloudinary'
import type { UploadedFile } from 'express-fileupload'
import { env } from '../config'
import { getImageError, getUploadedFiles, removeTmp } from '../helpers/files'
import { errorMessage } from '../helpers/http'

cloudinary.v2.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_API_KEY,
  api_secret: env.CLOUD_API_SECRET,
})

export const uploadToCloudinary = async (file: UploadedFile, path?: string) => {
  try {
    return await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: path,
      tags: 'basic_sample',
    })
  } finally {
    removeTmp(file.tempFilePath)
  }
}

export const uploadImages = async (req: Request<unknown, unknown, { path?: string }>, res: Response) => {
  try {
    const { path } = req.body
    const images = []
    for (const file of getUploadedFiles(req)) {
      images.push(await uploadToCloudinary(file, path))
    }
    res.json(images)
  } catch (error) {
    return res.status(500).json({ message: errorMessage(error) })
  }
}

export const deleteImage = async (req: Request<unknown, unknown, { publicId: string }>, res: Response) => {
  try {
    const { publicId } = req.body
    const delImg = await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: 'image',
    })
    res.json(delImg)
  } catch (error) {
    return res.status(500).json({ message: errorMessage(error) })
  }
}

export class ImageValidationError extends Error {}

/**
 * Uploads the request's single optional image and returns its URL, or `false` if
 * no image was sent. Throws `ImageValidationError` if the file isn't an acceptable image.
 */
export const uploadSingleImage = async (req: Pick<Request, 'files'>): Promise<string | false> => {
  const files = getUploadedFiles(req)
  if (files.length === 0) return false

  const error = getImageError(files)
  if (error) {
    files.forEach((file) => removeTmp(file.tempFilePath))
    throw new ImageValidationError(error)
  }

  if (files.length === 1) {
    const imageData = await uploadToCloudinary(files[0], 'gendut-grosir')
    if (imageData?.secure_url) return imageData.secure_url
  }
  return false
}
