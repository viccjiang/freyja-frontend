import { defu } from 'defu'
import type { UseFetchOptions } from 'nuxt/app'

type HttpOptions = Omit<UseFetchOptions<unknown>, 'method' | 'body'>

async function request<T = unknown>(url: string, options: Record<string, unknown>) {
  const config = useRuntimeConfig()
  const token = useTokenCookie()

  const defaults = {
    baseURL: config.public.apiBase,
    key: url,
    headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
    onRequestError({ response }: { response: { status: number } }) {
      if (import.meta.client) {
        console.error('Request error occurred.', response.status)
      }
    },
    onResponseError({ response }: { response: { status: number } }) {
      if (import.meta.client && response.status === 403) {
        const token = useTokenCookie()
        token.value = null
        navigateTo('/login')
      }
    }
  }

  const params = defu(options, defaults)

  const { data, status, error, refresh, clear, execute } = await useFetch<T>(url, params as Parameters<typeof useFetch<T>>[1])

  return { data, status, error, refresh, clear, execute }
}

const Http = {
  get: <T = unknown>(url: string, options: HttpOptions = {}) =>
    request<T>(url, { ...options, method: 'GET' }),
  post: <T = unknown>(url: string, body: unknown, options: HttpOptions = {}) =>
    request<T>(url, { ...options, method: 'POST', body }),
  put: <T = unknown>(url: string, body: unknown, options: HttpOptions = {}) =>
    request<T>(url, { ...options, method: 'PUT', body }),
  delete: <T = unknown>(url: string, options: HttpOptions = {}) =>
    request<T>(url, { ...options, method: 'DELETE' }),
  patch: <T = unknown>(url: string, body: unknown, options: HttpOptions = {}) =>
    request<T>(url, { ...options, method: 'PATCH', body })
}

export default Http
