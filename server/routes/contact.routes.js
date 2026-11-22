import express from 'express'
import contactCtrl from '../controllers/contact.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

function loadContact(req, res, next) {
  return contactCtrl.contactByID(
    req,
    res,
    next,
    req.params.contactId
  )
}

// Visitors can submit a message.
router.post('/api/contacts', contactCtrl.create)

// Only admins can list stored messages.
router.get(
  '/api/contacts',
  authCtrl.requireSignin,
  authCtrl.requireAdmin,
  contactCtrl.list
)

// Check permissions before loading an individual message.
router
  .route('/api/contacts/:contactId')
  .get(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    loadContact,
    contactCtrl.read
  )
  .put(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    loadContact,
    contactCtrl.update
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    loadContact,
    contactCtrl.remove
  )

export default router