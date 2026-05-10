export type ApiErrorResponse = {
  message?: string
}

type HttpMethod = 'POST' | 'PUT' | 'DELETE'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function readResponseBody<T>(response: Response): Promise<T> {
  const content = await response.text()

  if (!content) {
    return null as T
  }

  return JSON.parse(content) as T
}

async function handleError(response: Response): Promise<never> {
  const errorBody = await readResponseBody<ApiErrorResponse>(response).catch(() => null)

  const message =
    errorBody?.message ||
    `Request failed with status ${response.status}`

  throw new Error(message)
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    await handleError(response)
  }

  return readResponseBody<T>(response)
}

export async function apiSend<T>(
  path: string,
  method: HttpMethod,
  payload?: unknown,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: payload !== undefined ? JSON.stringify(payload) : undefined,
  })

  if (!response.ok) {
    await handleError(response)
  }

  if (response.status === 204) {
    return null as T
  }

  return readResponseBody<T>(response)
}