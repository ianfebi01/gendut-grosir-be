import { Router } from 'express'
import { getAnalytic } from '../controllers/analytic'
import { authUser } from '../middlewares/authUser'

const router = Router()

router.get('/analytic', authUser, getAnalytic)

export default router
