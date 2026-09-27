import { Router } from 'express'
import { getMenu, postDefaultMenu, postMenu } from '../controllers/menu'
import { authUser } from '../middlewares/authUser'
import { isAdmin } from '../middlewares/isAdmin'

const router = Router()

router.post('/menu', authUser, isAdmin, postMenu)
router.post('/default-menu', authUser, isAdmin, postDefaultMenu)
router.get('/menu', authUser, getMenu)

export default router
