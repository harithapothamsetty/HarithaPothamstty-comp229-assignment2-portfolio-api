import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import config from '../../config/config.js'

const requireSignin = (req, res, next) => {
  const token = req.cookies.t

  if (!token) {
    return res.status(401).json({
      error: 'You must sign in first'
    })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    req.auth = decoded
    next()
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid or expired token'
    })
  }
}

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(401).json({
        error: 'User with this email does not exist'
      })
    }

    const passwordMatches = bcrypt.compareSync(
      req.body.password,
      user.hashed_password
    )

    if (!passwordMatches) {
      return res.status(401).json({
        error: 'Email and password do not match'
      })
    }

    const token = jwt.sign(
      { _id: user._id },
      config.jwtSecret,
      { expiresIn: '1h' }
    )

    res.cookie('t', token, { httpOnly: true })

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (err) {
    return res.status(400).json({
      error: 'Could not sign in'
    })
  }
}

const signout = (req, res) => {
  res.clearCookie('t')
  return res.status(200).json({
    message: 'Signed out'
  })
}

export default { signin, signout, requireSignin }