import Contact from '../models/contact.model.js'
import errorHandler from './error.controller.js'

const create = async (req, res) => {
  try {
    const contact = new Contact({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message
    })

    await contact.save()

    return res.status(201).json({
      message: 'Your message was sent successfully!'
    })
  } catch (err) {
    return res.status(400).json({
      error:
        errorHandler.getErrorMessage(err) ||
        'Could not save your message'
    })
  }
}

const list = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .select(
        'firstname lastname email phone message createdAt updatedAt'
      )
      .sort({ createdAt: -1 })

    return res.json(contacts)
  } catch (err) {
    return res.status(400).json({
      error:
        errorHandler.getErrorMessage(err) ||
        'Could not retrieve contacts'
    })
  }
}

const contactByID = async (req, res, next, id) => {
  try {
    const contact = await Contact.findById(id)

    if (!contact) {
      return res.status(404).json({
        error: 'Contact not found'
      })
    }

    req.contact = contact
    return next()
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve contact'
    })
  }
}

const read = (req, res) => {
  return res.json(req.contact)
}

const update = async (req, res) => {
  try {
    const contact = req.contact

    const allowedFields = [
      'firstname',
      'lastname',
      'email',
      'phone',
      'message'
    ]

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        contact[field] = req.body[field]
      }
    }

    await contact.save()

    return res.json(contact)
  } catch (err) {
    return res.status(400).json({
      error:
        errorHandler.getErrorMessage(err) ||
        'Could not update contact'
    })
  }
}

const remove = async (req, res) => {
  try {
    await req.contact.deleteOne()

    return res.json({
      message: 'Contact deleted successfully'
    })
  } catch (err) {
    return res.status(400).json({
      error:
        errorHandler.getErrorMessage(err) ||
        'Could not delete contact'
    })
  }
}

export default {
  create,
  contactByID,
  read,
  list,
  remove,
  update
}