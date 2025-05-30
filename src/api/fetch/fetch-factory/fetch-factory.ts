import type { FetchConfig } from '@/api/fetch/types'
import { FetchInterceptorManager } from '@/api/fetch/fetch-interceptor-manager/fetch-interceptor-manager'
import { createBasApiExceptionFromResponseBody, createBaseApiExceptionFromUnknownError } from '@/common/exceptions'

function buildUrl (url: string, baseUrl: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  const cleanPath = url.startsWith('/') ? url : `/${url}`

  return `${cleanBaseUrl}${cleanPath}`
}

async function getBody<T> (response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/pdf')) {
    return response.blob() as T
  }
  if (contentType.includes('application/octet-stream')) {
    return await response.arrayBuffer() as T
  }
  if (contentType.includes('text')) {
    return await response.text() as T
  }

  return await response.json() as T
}

function mergeHeaders (defaultHeaders: HeadersInit = {}, requestHeaders: HeadersInit = {}): HeadersInit {
  const headers = new Headers()

  const appendHeaders = (source: HeadersInit) => {
    if (source instanceof Headers) {
      for (const [key, value] of source.entries()) {
        headers.append(key, value)
      }
    }
    else if (Array.isArray(source)) {
      source.forEach(([key, value]) => {
        headers.set(key, value)
      })
    }
    else if (source && typeof source === 'object') {
      Object.entries(source).forEach(([key, value]) => {
        headers.set(key, value)
      })
    }
  }

  appendHeaders(defaultHeaders)
  appendHeaders(requestHeaders)

  return headers
}

function createCustomFetch (config: FetchConfig = {}, interceptorManager: FetchInterceptorManager = new FetchInterceptorManager()) {
  const {
    baseUrl = __API_URL__,
    defaultHeaders = { 'Content-Type': 'application/json' },
  } = config

  return async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    try {
      const interceptedOptions = await interceptorManager.applyRequestInterceptors(url, options, config)

      const requestUrl = buildUrl(url, baseUrl)
      const mergedHeaders = mergeHeaders(defaultHeaders, interceptedOptions.headers)

      const requestInit: RequestInit = {
        ...interceptedOptions,
        headers: mergedHeaders,
      }

      const response = await fetch(requestUrl, {
        ...requestInit,
      })

      const interceptedResponse = await interceptorManager.applyResponseInterceptors(response)

      if (!interceptedResponse.ok) {
        const errorData: unknown = await getBody(interceptedResponse.clone())
        createBasApiExceptionFromResponseBody(interceptedResponse, errorData, requestInit.method,)
      }

      return await getBody<T>(interceptedResponse)
    }
    catch (error: unknown) {
      throw createBaseApiExceptionFromUnknownError(error)
    }
  }
}

export { createCustomFetch }
