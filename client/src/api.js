const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ''
).replace(/\/$/, '')

export async function apiRequest(
  path,
  { method = 'GET', body, signal } = {}
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body !== undefined
        ? { 'Content-Type': 'application/json' }
        : {})
    },
    ...(body !== undefined
      ? { body: JSON.stringify(body) }
      : {}),
    ...(signal ? { signal } : {})
  })

  const text = await response.text()
  let data = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error(
        'The server returned an unexpected response. Check that the backend is running.'
      )
    }
  }

  if (!response.ok) {
    const error = new Error(
      data?.error ||
      data?.message ||
      `Request failed with status ${response.status}`
    )

    error.status = response.status
    throw error
  }

  return data
}