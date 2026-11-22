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

export default function Project({ user }) {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState({ ...emptyForm })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const controller = new AbortController()

    async function loadProjects() {
      try {
        const data = await apiRequest('/api/projects', {
          signal: controller.signal
        })

        if (!Array.isArray(data)) {
          throw new Error(
            'The server returned an unexpected project list.'
          )
        }

        if (!controller.signal.aborted) {
          setProjects(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadProjects()

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

  function startEditing(project) {
    setEditingId(project._id)

    setForm({
      title: project.title || '',
      firstname: project.firstname || '',
      lastname: project.lastname || '',
      email: project.email || '',
      completion: project.completion
        ? project.completion.slice(0, 10)
        : '',
      description: project.description || ''
    })

    setError('')
    setMessage('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  function cancelEditing() {
    resetForm()
    setError('')
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!isAdmin || busy || loading) return

    setBusy(true)
    setError('')
    setMessage('')

    try {
      const saved = await apiRequest(
        editingId
          ? `/api/projects/${editingId}`
          : '/api/projects',
        {
          method: editingId ? 'PUT' : 'POST',
          body: form
        }
      )

      setProjects((current) =>
        editingId
          ? current.map((project) =>
              project._id === editingId ? saved : project
            )
          : [...current, saved]
      )

      setMessage(
        editingId
          ? 'Project updated successfully.'
          : 'Project added successfully.'
      )

      resetForm()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(project) {
    if (!isAdmin || busy) return

    const confirmed = window.confirm(
      `Delete "${project.title}"? This cannot be undone.`
    )

    if (!confirmed) return

    setBusy(true)
    setError('')
    setMessage('')

    try {
      await apiRequest(`/api/projects/${project._id}`, {
        method: 'DELETE'
      })

      setProjects((current) =>
        current.filter((item) => item._id !== project._id)
      )

      if (editingId === project._id) {
        resetForm()
      }

      setMessage('Project deleted successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="content-section education-section">
      <p className="eyebrow">Selected Work</p>
      <h1>Projects</h1>

      <p className="section-introduction">
        A selection of SAP BRIM, billing, and technology-focused work.
      </p>

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
          <h2>
            {editingId ? 'Edit Project' : 'Add Project'}
          </h2>

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
            <label htmlFor="project-title">
              Project Title
              <input
                id="project-title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="project-firstname">
              First Name
              <input
                id="project-firstname"
                name="firstname"
                type="text"
                value={form.firstname}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="project-lastname">
              Last Name
              <input
                id="project-lastname"
                name="lastname"
                type="text"
                value={form.lastname}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="project-email">
              Email
              <input
                id="project-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="project-completion">
              Completion / Expected Completion Date
              <input
                id="project-completion"
                name="completion"
                type="date"
                value={form.completion}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="project-description">
              Description
              <textarea
                id="project-description"
                name="description"
                rows="5"
                value={form.description}
                onChange={handleChange}
                required
              />
            </label>

            <button
              className="primary-button"
              type="submit"
            >
              {busy
                ? 'Saving...'
                : editingId
                  ? 'Save changes'
                  : 'Add project'}
            </button>

            {editingId && (
              <button
                className="secondary-button"
                type="button"
                onClick={cancelEditing}
              >
                Cancel editing
              </button>
            )}
          </fieldset>
        </form>
      )}

      {loading ? (
        <p role="status">Loading projects...</p>
      ) : (
        <>
          {!error && projects.length === 0 && (
            <p>No project records have been added yet.</p>
          )}

          {projects.map((project) => (
            <article
              className="education-card"
              key={project._id}
            >
              <p className="education-date">
                {project.completion?.slice(0, 10)}
              </p>

              <h2>{project.title}</h2>

              <p className="education-school">
                {project.firstname} {project.lastname}
              </p>

              <p style={{ whiteSpace: 'pre-wrap' }}>
                {project.description}
              </p>

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
                    onClick={() => startEditing(project)}
                  >
                    Edit
                  </button>

                  <button
                    className="secondary-button"
                    type="button"
                    disabled={busy}
                    onClick={() => handleDelete(project)}
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