import { Router } from 'express'
import { applyStockOpname, getStockOpname, postStockOpname } from '../controllers/stockOpname'
import { authUser } from '../middlewares/authUser'
import { isAdmin } from '../middlewares/isAdmin'

const router = Router()

router.post('/stockOpname', authUser, isAdmin, postStockOpname)
router.put('/stockOpname/:id', authUser, isAdmin, applyStockOpname)
router.get('/stockOpname', authUser, isAdmin, getStockOpname)

export default router
