import type { FetchOptions, ResponseInterceptorContext } from '@avenirs-esr/shared'
import { AvIsoLocaleMap, configureSharedFetch, FetchInterceptorManager, HttpStatusCode } from '@avenirs-esr/shared'
import { SessionCheck } from '@/features/auth/global/stores/auth.store.types'
import { i18n } from '@/plugins/vue-i18n'

const interceptorManager = new FetchInterceptorManager()

interceptorManager.addRequestInterceptor((url: string, options: RequestInit) => {
  const locale = i18n.global.locale.value
  const isoLocale = AvIsoLocaleMap[locale as keyof typeof AvIsoLocaleMap] ?? AvIsoLocaleMap.fr

  options.headers = {
    ...options.headers,
    'x-signed-context': 'student',
    'Accept-Language': isoLocale,
    'Authorization': __BEARER_TOKEN__,
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
        return fetch(context.url, context.options)
      case SessionCheck.UNAUTHORIZED: {
        const { default: router } = await import('@/router')
        const route = router.currentRoute.value

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

const fetchConfig = {
  baseUrl: `${__BASE_URL__}`,
  defaultHeaders: { 'Content-Type': 'application/json' },
}

configureSharedFetch(fetchConfig, interceptorManager)
