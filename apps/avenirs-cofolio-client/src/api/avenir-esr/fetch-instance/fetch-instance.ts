import type { FetchOptions, ResponseInterceptorContext } from '@/api/fetch'
import type { BaseApiException } from '@/common/exceptions'
import { createCustomFetch, FetchInterceptorManager } from '@/api/fetch'
import { HttpStatusCode } from '@/common/utils'
import { SessionCheck } from '@/features/auth/global/stores/auth.store.types'
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
    'Authorization': __BEARER_TOKEN__,
    // header set only in development mode to be able to use local api, see @vite.config.ts
    ...(__USER_EPPN__ != null ? { eppn: __USER_EPPN__ } : {})
  }
  return options
})

interceptorManager.addResponseInterceptor(async (response: Response, context: ResponseInterceptorContext): Promise<Response> => {
  const skip = (context.options as FetchOptions).skipUnauthorizedHandling

  if (response.status === HttpStatusCode.UNAUTHORIZED && !skip) {
    const { useAuthStore } = await import('@/features/auth/global/stores/auth.store')
    const auth = useAuthStore()

    switch (await auth.revalidateSession()) {
      case SessionCheck.VALID:
        // Replayed once, straight with fetch: the replay does not go through the interceptors again,
        // so a second 401 reaches the caller as a regular error instead of looping
        return fetch(context.url, context.options)
      case SessionCheck.UNAUTHORIZED: {
        const { default: router } = await import('@/router')
        const route = router.currentRoute.value

        // A 401 is authoritative, even on a public route: the request proves that the page needs a session.
        // A call that may legitimately answer 401 there must opt out with `skipUnauthorizedHandling`.
        if (import.meta.env?.DEV && route.meta.public === true) {
          throw new Error(
            `[fetch] 401 on ${context.url} from the public route ${route.fullPath}: `
            + 'the page calls a protected endpoint, or the endpoint is wrongly secured '
            + '(flag the call with skipUnauthorizedHandling if a 401 is expected here).'
          )
        }

        const toLogin = auth.redirectToLogin(route.fullPath)

        if (toLogin !== undefined) {
          await router.replace(toLogin)
        }

        return new Promise<Response>(() => {})
      }
      case SessionCheck.ERROR:
        break
    }
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
