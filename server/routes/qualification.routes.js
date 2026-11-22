import express from 'express'
import qualificationCtrl from '../controllers/qualification.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

function loadQualification(req, res, next) {
  return qualificationCtrl.qualificationByID(
    req,
    res,
    next,
    req.params.qualificationId
  )
}

router
  .route('/api/qualifications')
  .get(qualificationCtrl.list)
  .post(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    qualificationCtrl.create
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    qualificationCtrl.removeAll
  )

router
  .route('/api/qualifications/:qualificationId')
  .get(
    loadQualification,
    qualificationCtrl.read
  )
  .put(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    loadQualification,
    qualificationCtrl.update
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    loadQualification,
    qualificationCtrl.remove
  )

export default router