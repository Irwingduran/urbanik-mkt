// Lightweight wrapper around fetch to add a client-side request id
// and consistent error handling for the frontend.

export interface ApiFetchOptions extends RequestInit {
  requestId?: string
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
      const err = new Error(`API ${res.status}: ${res.statusText} ${text}`)
      ;(err as any).status = res.status
      ;(err as any).body = text
      throw err
    }
    return res
  } finally {
    clearTimeout(timeout)
  }
}

export async function apiJson<T = any>(input: RequestInfo | URL, init?: ApiFetchOptions): Promise<T> {
  const res = await apiFetch(input, init)
  return res.json() as Promise<T>
}
