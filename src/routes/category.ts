import { Router } from 'express'
import { deleteCategory, getCategory, postCategory, updateCategory } from '../controllers/category'
import { authUser } from '../middlewares/authUser'

const router = Router()

router.post('/category', authUser, postCategory)
router.get('/category', authUser, getCategory)
router.delete('/category/:id', authUser, deleteCategory)
router.put('/category/:id', authUser, updateCategory)

export default router
