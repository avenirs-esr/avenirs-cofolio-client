import { createCustomFetch, FetchInterceptorManager } from '@/api/fetch'

const interceptorManager = new FetchInterceptorManager()

interceptorManager.addRequestInterceptor((url: string, options: RequestInit) => {
  // TODO: add any request-specific logic here (headers, params ...)
  options.headers = {
    ...options.headers,
    'x-signed-context': 'student',
    'Authorization': __BEARER_TOKEN__
  }
  return options
})

const fetcher = createCustomFetch({
  baseUrl: `${__BASE_URL__}`,
  defaultHeaders: { 'Content-Type': 'application/json' },
}, interceptorManager)

export async function customFetch<T> (url: string, options: RequestInit): Promise<T> {
  return fetcher<T>(url, options)
}
