import { useState } from 'react'
import { apiRequest } from './api'

export default function AuthForm({ mode, onSignedIn, onChangeMode }) {
  const isSignup = mode === 'signup'

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value
    }))

    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setBusy(true)
    setError('')
    setSuccess('')

    try {
      if (isSignup) {
        await apiRequest('/api/users', {
          method: 'POST',
          body: {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password
          }
        })

        setForm({
          name: '',
          email: '',
          password: ''
        })

        setSuccess(
          'Account created successfully. Select Sign in below to log in.'
        )
      } else {
        const data = await apiRequest('/auth/signin', {
          method: 'POST',
          body: {
            email: form.email.trim(),
            password: form.password
          }
        })

        onSignedIn(data.user)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section
      className="content-section"
      style={{ maxWidth: '540px', margin: '0 auto' }}
    >
      <p className="eyebrow">Your Account</p>

      <h1>{isSignup ? 'Sign up' : 'Sign in'}</h1>

      <p className="section-introduction">
        {isSignup
          ? 'Create an account to access the portfolio as a regular user.'
          : 'Sign in with your portfolio account.'}
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <fieldset
          disabled={busy}
          style={{
            border: 0,
            padding: 0,
            margin: 0,
            minWidth: 0,
            display: 'grid',
            gap: '18px'
          }}
        >
          {isSignup && (
            <label htmlFor="auth-name">
              Full Name
              <input
                id="auth-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
          )}

          <label htmlFor="auth-email">
            Email Address
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="auth-password">
            Password
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={
                isSignup ? 'new-password' : 'current-password'
              }
              minLength={isSignup ? 6 : undefined}
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {isSignup && (
            <p style={{ margin: 0 }}>
              Use at least 6 characters. New accounts receive the user role.
            </p>
          )}

          <button className="primary-button" type="submit">
            {busy
              ? 'Please wait...'
              : isSignup
                ? 'Create account'
                : 'Sign in'}
          </button>
        </fieldset>

        {error && (
          <p role="alert" style={{ color: '#a12622', margin: 0 }}>
            {error}
          </p>
        )}

        {success && (
          <p className="form-message" role="status">
            {success}
          </p>
        )}

        <button
          className="secondary-button"
          type="button"
          disabled={busy}
          style={{ marginTop: 0 }}
          onClick={() =>
            onChangeMode(isSignup ? 'signin' : 'signup')
          }
        >
          {isSignup
            ? 'Already have an account? Sign in'
            : 'Need an account? Sign up'}
        </button>
      </form>
    </section>
  )
}