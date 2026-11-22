import { useEffect, useState } from 'react'
import { apiRequest } from './api'

const emptyForm = {
  title: '',
  firstname: '',
  lastname: '',
  email: '',
  completion: '',
  description: ''
}

export default function Education({ user }) {
  const [qualifications, setQualifications] = useState([])
  const [form, setForm] = useState({ ...emptyForm })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const controller = new AbortController()

    async function loadQualifications() {
      try {
        const data = await apiRequest('/api/qualifications', {
          signal: controller.signal
        })

        if (!Array.isArray(data)) {
          throw new Error('The server returned an unexpected education list.')
        }

        setQualifications(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadQualifications()
    return () => controller.abort()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  function resetForm() {
    setForm({ ...emptyForm })
    setEditingId(null)
  }

  function startEditing(qualification) {
    setEditingId(qualification._id)
    setForm({
      title: qualification.title || '',
      firstname: qualification.firstname || '',
      lastname: qualification.lastname || '',
      email: qualification.email || '',
      completion: qualification.completion
        ? qualification.completion.slice(0, 10)
        : '',
      description: qualification.description || ''
    })
    setError('')
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!isAdmin || busy) return

    setBusy(true)
    setError('')
    setMessage('')

    try {
      const saved = await apiRequest(
        editingId
          ? `/api/qualifications/${editingId}`
          : '/api/qualifications',
        {
          method: editingId ? 'PUT' : 'POST',
          body: form
        }
      )

      setQualifications((current) =>
        editingId
          ? current.map((item) =>
              item._id === editingId ? saved : item
            )
          : [...current, saved]
      )

      setMessage(
        editingId
          ? 'Education updated successfully.'
          : 'Education added successfully.'
      )
      resetForm()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(qualification) {
    if (!isAdmin || busy) return

    const confirmed = window.confirm(
      `Delete "${qualification.title}"? This cannot be undone.`
    )

    if (!confirmed) return

    setBusy(true)
    setError('')
    setMessage('')

    try {
      await apiRequest(
        `/api/qualifications/${qualification._id}`,
        { method: 'DELETE' }
      )

      setQualifications((current) =>
        current.filter((item) => item._id !== qualification._id)
      )

      if (editingId === qualification._id) {
        resetForm()
      }

      setMessage('Education deleted successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="content-section education-section">
      <p className="eyebrow">Learning Journey</p>
      <h1>Education</h1>

      {error && (
        <p role="alert" style={{ color: '#a12622' }}>
          {error}
        </p>
      )}

      {message && (
        <p role="status" className="form-message">
          {message}
        </p>
      )}

      {isAdmin && (
        <form
          className="contact-form"
          onSubmit={handleSubmit}
          style={{
            maxWidth: '760px',
            margin: '0 auto 32px',
            textAlign: 'left'
          }}
        >
          <h2>{editingId ? 'Edit Education' : 'Add Education'}</h2>

          <fieldset
            disabled={busy || loading}
            style={{
              border: 0,
              padding: 0,
              margin: 0,
              minWidth: 0,
              display: 'grid',
              gap: '16px'
            }}
          >
            <label htmlFor="education-title">
              Qualification Title
              <input
                id="education-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="education-firstname">
              First Name
              <input
                id="education-firstname"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="education-lastname">
              Last Name
              <input
                id="education-lastname"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="education-email">
              Email
              <input
                id="education-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="education-completion">
              Completion / Expected Completion Date
              <input
                id="education-completion"
                name="completion"
                type="date"
                value={form.completion}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="education-description">
              Description
              <textarea
                id="education-description"
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required
              />
            </label>

            <button className="primary-button" type="submit">
              {busy
                ? 'Saving...'
                : editingId
                  ? 'Save changes'
                  : 'Add education'}
            </button>

            {editingId && (
              <button
                className="secondary-button"
                type="button"
                onClick={resetForm}
              >
                Cancel editing
              </button>
            )}
          </fieldset>
        </form>
      )}

      {loading ? (
        <p role="status">Loading education...</p>
      ) : (
        <>
          {!error && qualifications.length === 0 && (
            <p>No education records have been added yet.</p>
          )}

          {qualifications.map((qualification) => (
            <article
              className="education-card"
              key={qualification._id}
            >
              <p className="education-date">
                {qualification.completion?.slice(0, 10)}
              </p>

              <h2>{qualification.title}</h2>

              <p className="education-school">
                {qualification.firstname} {qualification.lastname}
              </p>

              <p>{qualification.description}</p>

              {isAdmin && (
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginTop: '20px'
                  }}
                >
                  <button
                    className="secondary-button"
                    type="button"
                    disabled={busy}
                    onClick={() => startEditing(qualification)}
                  >
                    Edit
                  </button>

                  <button
                    className="secondary-button"
                    type="button"
                    disabled={busy}
                    onClick={() => handleDelete(qualification)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
        </>
      )}
    </section>
  )
}