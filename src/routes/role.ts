import { Router } from 'express'
import { getRole, postDefaultRole, updateRole } from '../controllers/role'

const router = Router()

router.post('/post-default-role', postDefaultRole)
router.get('/getRole', getRole)
router.put('/updateRole/:id', updateRole)

export default router
