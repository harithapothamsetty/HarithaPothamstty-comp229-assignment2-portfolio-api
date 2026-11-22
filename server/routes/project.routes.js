import express from 'express'
import projectCtrl from '../controllers/project.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

function loadProject(req, res, next) {
  return projectCtrl.projectByID(
    req,
    res,
    next,
    req.params.projectId
  )
}

router
  .route('/api/projects')
  .get(projectCtrl.list)
  .post(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    projectCtrl.create
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    projectCtrl.removeAll
  )

router
  .route('/api/projects/:projectId')
  .get(
    loadProject,
    projectCtrl.read
  )
  .put(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    loadProject,
    projectCtrl.update
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    loadProject,
    projectCtrl.remove
  )

export default router