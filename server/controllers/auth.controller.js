import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import config from '../../config/config.js'

const requireSignin = async (req, res, next) => {
  const authorization = req.headers.authorization

  const bearerToken =
    authorization && authorization.startsWith('Bearer ')
      ? authorization.slice(7).trim()
      : null

  const token = bearerToken || req.cookies?.t

  if (!token) {
    return res.status(401).json({
      error: 'You must sign in first'
    })
  }

  let decoded

  try {
    decoded = jwt.verify(token, config.jwtSecret)
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid or expired token'
    })
  }

  try {
    const user = await User.findById(decoded._id).select(
      '_id name email role'
    )

    if (!user) {
      return res.status(401).json({
        error: 'User account no longer exists'
      })
    }

    req.auth = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    }

    return next()
  } catch (err) {
    return res.status(500).json({
      error: 'Could not verify user account'
    })
  }
}

const requireAdmin = (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({
      error: 'You must sign in first'
    })
  }

  if (req.auth.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin access required'
    })
  }

  return next()
}

const signin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: 'Email and password are required'
      })
    }

    const user = await User.findOne({
      email: email.trim()
    })

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      })
    }

    const passwordMatches = bcrypt.compareSync(
      password,
      user.hashed_password
    )

    if (!passwordMatches) {
      return res.status(401).json({
        error: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      { _id: user._id },
      config.jwtSecret,
      { expiresIn: '1h' }
    )

    res.cookie('t', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000
    })

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    })
  } catch (err) {
    return res.status(400).json({
      error: 'Could not sign in'
    })
  }
}

const signout = (req, res) => {
  res.clearCookie('t', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })

  return res.status(200).json({
    message: 'Signed out'
  })
}

export default {
  signin,
  signout,
  requireSignin,
  requireAdmin
}