import User from '../models/user.model.js'
import errorHandler from './error.controller.js'

const create = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: 'user'
    })

    await user.save()

    return res.status(201).json({
      message: 'Successfully signed up!'
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const list = async (req, res) => {
  try {
    const users = await User.find().select(
      'name email role updated created'
    )

    return res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    req.profile = user
    next()
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve user'
    })
  }
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined

  return res.json(req.profile)
}

const update = async (req, res) => {
  try {
    const user = req.profile

    if (req.body.name !== undefined) {
      user.name = req.body.name
    }

    if (req.body.email !== undefined) {
      user.email = req.body.email
    }

    if (req.body.password !== undefined) {
      user.password = req.body.password
    }

    user.updated = Date.now()

    await user.save()

    user.hashed_password = undefined
    user.salt = undefined

    return res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    const user = req.profile

    await user.deleteOne()

    return res.json({
      message: 'User deleted successfully'
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update
}