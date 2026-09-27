import { Router } from 'express'
import { deleteImage, uploadImages } from '../controllers/upload'
import { authUser } from '../middlewares/authUser'
import { imageUpload } from '../middlewares/imageUpload'
import { isAdmin } from '../middlewares/isAdmin'

const router = Router()

router.post('/uploadImages', authUser, isAdmin, imageUpload, uploadImages)
router.post('/deleteImage', authUser, isAdmin, deleteImage)

export default router
