import { defu } from 'defu'

async function request(url: string, options: any) {
  const config = useRuntimeConfig()
  const token = useCookie('token')

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
      if (import.meta.client) {
      }
      setTimeout(() => {
        if (response.status === 403) {
          navigateTo('/login')
        }
      }, 2000)
    }
  }

  const params = defu(options, defaults)

  const { data: response, refresh, execute } = await useFetch(url, params)

  return { response, refresh, execute }
}

const Http = {
  get: (url: string, options: any = {}) => request(url, { ...options, method: 'GET' }),
  post: (url: string, body: any, options: any = {}) =>
    request(url, { ...options, method: 'POST', body }),
  put: (url: string, body: any, options: any = {}) =>
    request(url, { ...options, method: 'PUT', body }),
  delete: (url: string, options: any = {}) => request(url, { ...options, method: 'DELETE' }),
  patch: (url: string, body: any, options: any = {}) =>
    request(url, { ...options, method: 'PATCH', body })
}

export default Http
