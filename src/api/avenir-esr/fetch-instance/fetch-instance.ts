import type { BaseApiException } from '@/common/exceptions'
import { createCustomFetch, FetchInterceptorManager, type FetchOptions, type ResponseInterceptorContext } from '@/api/fetch'
import { HttpStatusCode } from '@/common/utils'
import { i18n } from '@/plugins/vue-i18n'
import { AvIsoLocaleMap } from '@/types'

const interceptorManager = new FetchInterceptorManager()

interceptorManager.addRequestInterceptor((url: string, options: RequestInit) => {
  // TODO: add any request-specific logic here (headers, params ...)
  const locale = i18n.global.locale.value
  const isoLocale = AvIsoLocaleMap[locale as keyof typeof AvIsoLocaleMap] ?? AvIsoLocaleMap.fr

  options.headers = {
    ...options.headers,
    'x-signed-context': 'student',
    'Accept-Language': isoLocale,
    'Authorization': __BEARER_TOKEN__
  }
  return options
})

interceptorManager.addResponseInterceptor(async (response: Response, context: ResponseInterceptorContext): Promise<Response> => {
  const skip = (context.options as FetchOptions).skipUnauthorizedHandling

  if (response.status === HttpStatusCode.UNAUTHORIZED && !skip) {
    const { useAuthStore } = await import('@/features/auth/global/stores/auth.store')
    const authStore = useAuthStore()

    await authStore.ensureAuthenticated({ force: true })

    return new Promise<Response>(() => {})
  }

  return response
})

const fetcher = createCustomFetch({
  baseUrl: `${__BASE_URL__}`,
  defaultHeaders: { 'Content-Type': 'application/json' },
}, interceptorManager)

export async function customFetch<T> (url: string, options: RequestInit): Promise<T> {
  return fetcher<T>(url, options)
}

export type ErrorType<_Error> = BaseApiException

export type BodyType<BodyData> = BodyData
