import { useEffect, useState } from 'react'
import { apiRequest } from './api'

const emptyForm = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  message: ''
}

function Contact({ user }) {
  const isAdmin = user?.role === 'admin'

  const [form, setForm] = useState({ ...emptyForm })
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState('')
  const [adminSuccess, setAdminSuccess] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!isAdmin) {
      setContacts([])
      setEditingId(null)
      setListError('')
      setAdminSuccess('')
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function loadContacts() {
      setLoading(true)
      setListError('')

      try {
        const data = await apiRequest('/api/contacts', {
          signal: controller.signal
        })

        if (!controller.signal.aborted) {
          if (!Array.isArray(data)) {
            throw new Error(
              'The contacts API did not return a list.'
            )
          }

          setContacts(data)
        }
      } catch (err) {
        if (controller.signal.aborted) return

        setListError(
          err.message || 'Could not load contact messages.'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadContacts()

    return () => controller.abort()
  }, [isAdmin, user?._id, refreshKey])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value
    }))

    setSubmitError('')
    setSubmitSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (sending) return

    setSending(true)
    setSubmitError('')
    setSubmitSuccess('')

    try {
      const data = await apiRequest('/api/contacts', {
        method: 'POST',
        body: {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim()
        }
      })

      setSubmitSuccess(
        data.message || 'Your message was sent successfully!'
      )
      setForm({ ...emptyForm })

      if (isAdmin) {
        setRefreshKey((previous) => previous + 1)
      }
    } catch (err) {
      setSubmitError(
        err.message || 'Could not send your message.'
      )
    } finally {
      setSending(false)
    }
  }

  function startEditing(contact) {
    setEditingId(contact._id)
    setEditForm({
      firstname: contact.firstname || '',
      lastname: contact.lastname || '',
      email: contact.email || '',
      phone: contact.phone || '',
      message: contact.message || ''
    })

    setListError('')
    setAdminSuccess('')
  }

  function cancelEditing() {
    setEditingId(null)
    setEditForm({ ...emptyForm })
  }

  function handleEditChange(event) {
    const { name, value } = event.target

    setEditForm((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  async function handleUpdate(event) {
    event.preventDefault()

    if (!isAdmin || !editingId || saving) return

    setSaving(true)
    setListError('')
    setAdminSuccess('')

    try {
      const updatedContact = await apiRequest(
        `/api/contacts/${editingId}`,
        {
          method: 'PUT',
          body: {
          firstname: editForm.firstname.trim(),
          lastname: editForm.lastname.trim(),
          email: editForm.email.trim(),
          phone: editForm.phone.trim(),
          message: editForm.message.trim()
        }
        }
      )

      setContacts((previous) =>
        previous.map((contact) =>
          contact._id === editingId
            ? updatedContact
            : contact
        )
      )

      cancelEditing()
      setAdminSuccess('Contact updated successfully.')
    } catch (err) {
      setListError(
        err.message || 'Could not update the contact.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(contact) {
    if (!isAdmin || deletingId || saving) return

    const confirmed = window.confirm(
      `Delete the message from ${contact.firstname} ${contact.lastname}?`
    )

    if (!confirmed) return

    setDeletingId(contact._id)
    setListError('')
    setAdminSuccess('')

    try {
      await apiRequest(`/api/contacts/${contact._id}`, {
        method: 'DELETE'
      })

      setContacts((previous) =>
        previous.filter(
          (item) => item._id !== contact._id
        )
      )

      if (editingId === contact._id) {
        cancelEditing()
      }

      setAdminSuccess('Contact deleted successfully.')
    } catch (err) {
      setListError(
        err.message || 'Could not delete the contact.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  function renderFields(values, onChange, prefix) {
    return (
      <>
        <label htmlFor={`${prefix}-firstname`}>
          First Name
          <input
            id={`${prefix}-firstname`}
            name="firstname"
            type="text"
            value={values.firstname}
            onChange={onChange}
            autoComplete="given-name"
            required
          />
        </label>

        <label htmlFor={`${prefix}-lastname`}>
          Last Name
          <input
            id={`${prefix}-lastname`}
            name="lastname"
            type="text"
            value={values.lastname}
            onChange={onChange}
            autoComplete="family-name"
            required
          />
        </label>

        <label htmlFor={`${prefix}-phone`}>
          Contact Number
          <input
            id={`${prefix}-phone`}
            name="phone"
            type="tel"
            value={values.phone}
            onChange={onChange}
            autoComplete="tel"
          />
        </label>

        <label htmlFor={`${prefix}-email`}>
          Email Address
          <input
            id={`${prefix}-email`}
            name="email"
            type="email"
            value={values.email}
            onChange={onChange}
            autoComplete="email"
            required
          />
        </label>

        <label htmlFor={`${prefix}-message`}>
          Message
          <textarea
            id={`${prefix}-message`}
            name="message"
            rows="5"
            value={values.message}
            onChange={onChange}
            required
          />
        </label>
      </>
    )
  }

  return (
    <>
      <section className="contact-section">
        <div className="contact-details">
          <p className="eyebrow">Get In Touch</p>
          <h1>Contact Me</h1>

          <p>
            Have a question or would like to connect?
            Send a message using the form.
          </p>

          <div className="contact-panel">
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:hpotham1@mycentennialcollege.ca">
                hpotham1@mycentennialcollege.ca
              </a>
            </p>

            <p>
              <strong>Location:</strong>{' '}
              Scarborough, Ontario, Canada
            </p>

            <p>
              <strong>Focus:</strong>{' '}
              SAP BRIM, billing reconciliation, and web
              application development
            </p>
          </div>
        </div>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >
          {renderFields(form, handleChange, 'contact')}

          <button
            className="primary-button"
            type="submit"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send message'}
          </button>

          {submitError && (
            <p role="alert" style={{ color: '#a12622' }}>
              {submitError}
            </p>
          )}

          {submitSuccess && (
            <p
              className="form-message"
              role="status"
              style={{ color: '#28633c' }}
            >
              {submitSuccess}
            </p>
          )}
        </form>
      </section>

      {isAdmin && (
        <section
          className="content-section"
          style={{ marginTop: '48px' }}
        >
          <p className="eyebrow">Admin Management</p>
          <h2>Contact Messages</h2>

          <p className="section-introduction">
            View, edit, and delete stored contact submissions.
          </p>

          <button
            className="secondary-button"
            type="button"
            disabled={loading || saving || Boolean(deletingId)}
            onClick={() =>
              setRefreshKey((previous) => previous + 1)
            }
          >
            {loading ? 'Loading...' : 'Refresh messages'}
          </button>

          {listError && (
            <p role="alert" style={{ color: '#a12622' }}>
              {listError}
            </p>
          )}

          {adminSuccess && (
            <p role="status" style={{ color: '#28633c' }}>
              {adminSuccess}
            </p>
          )}

          {loading ? (
            <p role="status">Loading contact messages...</p>
          ) : (
            <>
              {!listError && contacts.length === 0 && (
                <p>No contact messages have been submitted yet.</p>
              )}

              <div
                className="card-grid"
                style={{ marginTop: '24px' }}
              >
                {contacts.map((contact) => (
                  <article
                    className="content-card"
                    key={contact._id}
                  >
                    {editingId === contact._id ? (
                      <form
                        className="contact-form"
                        onSubmit={handleUpdate}
                      >
                        <h3>Edit Contact</h3>

                        {renderFields(
                          editForm,
                          handleEditChange,
                          `edit-${contact._id}`
                        )}

                        <div
                          style={{
                            display: 'flex',
                            gap: '12px',
                            flexWrap: 'wrap'
                          }}
                        >
                          <button
                            className="primary-button"
                            type="submit"
                            disabled={saving}
                          >
                            {saving
                              ? 'Saving...'
                              : 'Save changes'}
                          </button>

                          <button
                            className="secondary-button"
                            type="button"
                            disabled={saving}
                            onClick={cancelEditing}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <h3>
                          {contact.firstname} {contact.lastname}
                        </h3>

                        <p>
                          Email: {contact.email}
                        </p>

                        <p>
                          Phone: {contact.phone || 'Not provided'}
                        </p>

                        <p
                          style={{
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'anywhere'
                          }}
                        >
                          {contact.message}
                        </p>

                        {contact.createdAt && (
                          <p className="card-detail">
                            Received:{' '}
                            {new Date(
                              contact.createdAt
                            ).toLocaleString()}
                          </p>
                        )}

                        <div
                          style={{
                            display: 'flex',
                            gap: '12px',
                            flexWrap: 'wrap',
                            marginTop: '16px'
                          }}
                        >
                          <button
                            className="secondary-button"
                            type="button"
                            disabled={
                              saving || Boolean(deletingId)
                            }
                            onClick={() =>
                              startEditing(contact)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="secondary-button"
                            type="button"
                            disabled={
                              saving || Boolean(deletingId)
                            }
                            onClick={() =>
                              handleDelete(contact)
                            }
                          >
                            {deletingId === contact._id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        </div>
                      </>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </>
  )
}

export default Contact