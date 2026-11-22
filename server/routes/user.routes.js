import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

// Public signup: the controller always assigns the "user" role.
router.post('/api/users', userCtrl.create)

// User account information is restricted to admins.
router.get(
  '/api/users',
  authCtrl.requireSignin,
  authCtrl.requireAdmin,
  userCtrl.list
)

// Authenticate and authorize before loading the requested account.
router.use(
  '/api/users/:userId',
  authCtrl.requireSignin,
  authCtrl.requireAdmin
)

router.param('userId', userCtrl.userByID)

router
  .route('/api/users/:userId')
  .get(userCtrl.read)
  .put(userCtrl.update)
  .delete(userCtrl.remove)

export default router