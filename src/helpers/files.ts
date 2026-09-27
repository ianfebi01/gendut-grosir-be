import fs from 'fs'
import type { Request } from 'express'
import type { UploadedFile } from 'express-fileupload'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_IMAGE_SIZE = 1024 * 1024 * 10

export const getUploadedFiles = (req: Pick<Request, 'files'>): UploadedFile[] =>
  req.files ? Object.values(req.files).flat() : []

export const removeTmp = (path: string) => {
  fs.unlink(path, (err) => {
    if (err) console.warn(err)
  })
}

/** Returns an error message if any file is not an acceptable image, otherwise null. */
export const getImageError = (files: UploadedFile[]): string | null => {
  if (files.length === 0) return 'No files selected.'
  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) return 'Unsupported format.'
    if (file.size > MAX_IMAGE_SIZE) return 'File size is too large.'
  }
  return null
}
