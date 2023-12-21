const express = require('express')
const { getRole, updateRole, postDefaultRole } = require('../controllers/role')

const router = express.Router()

router.post('/post-default-role', postDefaultRole)
router.get('/getRole', getRole)

router.put('/updateRole/:id', updateRole)

module.exports = router
