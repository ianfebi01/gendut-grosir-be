const express = require('express')
const { getRole, updateRole } = require('../controllers/role')

const router = express.Router()

router.get('/getRole', getRole)

router.put('/updateRole', updateRole)

module.exports = router
