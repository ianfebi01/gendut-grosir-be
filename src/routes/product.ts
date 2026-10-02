import { Router } from 'express'
import {
  deleteProduct,
  getProduct,
  getProductByBarcode,
  getProductById,
  postProduct,
  updateProduct,
  updateProductStockByBarcode,
} from '../controllers/product'
import { authUser } from '../middlewares/authUser'
import { isAdmin } from '../middlewares/isAdmin'

const router = Router()

router.post('/product', authUser, isAdmin, postProduct)
router.get('/product', authUser, getProduct)
router.get('/product/:id', authUser, getProductById)
router.get('/productByBarcode/:barcode', authUser, getProductByBarcode)
router.put('/product/:id', authUser, isAdmin, updateProduct)
router.put('/product/stockbarcode/:barcode', authUser, isAdmin, updateProductStockByBarcode)
router.delete('/product/:id', authUser, isAdmin, deleteProduct)

export default router
