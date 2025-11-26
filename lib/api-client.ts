// Lightweight wrapper around fetch to add a client-side request id
// and consistent error handling for the frontend.

export interface ApiFetchOptions extends RequestInit {
  requestId?: string
}

export class ApiError extends Error {
  status: number
  body: string
  constructor(message: string, status: number, body: string) {
    super(message)
    this.status = status
    this.body = body
  }
}

export async function apiFetch(input: RequestInfo | URL, init: ApiFetchOptions = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), init.signal ? 0 : 30000)

  const headers = new Headers(init.headers || {})
  const requestId = init.requestId || (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : undefined)
  if (requestId) headers.set('x-client-request-id', requestId)

  try {
    const res = await fetch(input, { ...init, headers, signal: init.signal || controller.signal, cache: init.cache || 'no-store' })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new ApiError(`API ${res.status}: ${res.statusText} ${text}`, res.status, text)
    }
    return res
  } finally {
    clearTimeout(timeout)
  }
}

export async function apiJson<T = unknown>(input: RequestInfo | URL, init?: ApiFetchOptions): Promise<T> {
  const res = await apiFetch(input, init)
  return res.json() as Promise<T>
}
