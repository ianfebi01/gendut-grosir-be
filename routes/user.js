const express = require('express')
const {
  getMe,
  getAllUser,
  register,
  login,
  deleteUser,
  getUserById,
  editUser,
} = require('../controllers/user')

const { authUser } = require('../middlewares/authUser')
const { isAdmin } = require('../middlewares/isAdmin')

const router = express.Router()

router.get('/me', authUser, getMe)
router.get('/getUserById/:id', authUser, getUserById)
router.put('/editUser/:id', authUser, isAdmin, editUser)
router.get('/getAllUser', authUser, isAdmin, getAllUser)
router.post('/register', register)
router.post('/login', login)
router.delete('/deleteUser/:id', authUser, isAdmin, deleteUser)

module.exports = router
