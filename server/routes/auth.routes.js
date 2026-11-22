import express from 'express'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/auth/signin').post(authCtrl.signin)

router.route('/auth/signout').get(authCtrl.signout)

router.route('/auth/me').get(
  authCtrl.requireSignin,
  (req, res) => {
    res.set('Cache-Control', 'no-store')

    return res.json({
      user: req.auth
    })
  }
)

export default router