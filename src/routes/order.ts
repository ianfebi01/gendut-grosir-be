import { Router } from 'express'
import {
  cancelOrder,
  changeStatusOrder,
  getOrder,
  postOrder,
  updateTime,
} from '../controllers/order'
import { authUser } from '../middlewares/authUser'
import { isAdmin } from '../middlewares/isAdmin'

const router = Router()

router.post('/order', authUser, postOrder)
router.put('/changeStatusOrder/:orderId', authUser, changeStatusOrder)
router.put('/cancelOrder/:orderId', authUser, cancelOrder)
router.get('/order', authUser, isAdmin, getOrder)
router.get('/order/updateTime', updateTime)

export default router
