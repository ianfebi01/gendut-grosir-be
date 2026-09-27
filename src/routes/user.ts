import { Router } from 'express'
import {
  deleteUser,
  editUser,
  getAllUser,
  getMe,
  getUserById,
  login,
  register,
} from '../controllers/user'
import { authUser } from '../middlewares/authUser'
import { isAdmin } from '../middlewares/isAdmin'

const router = Router()

router.get('/me', authUser, getMe)
router.get('/getUserById/:id', authUser, getUserById)
router.put('/editUser/:id', authUser, isAdmin, editUser)
router.get('/getAllUser', authUser, isAdmin, getAllUser)
router.post('/register', register)
router.post('/login', login)
router.delete('/deleteUser/:id', authUser, isAdmin, deleteUser)

export default router
