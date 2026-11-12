import { AvIsoLocaleMap, configureSharedFetch, FetchInterceptorManager } from '@avenirs-esr/shared'
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

interceptorManager.addResponseInterceptor(async (response: Response): Promise<Response> => {
  return response
})

const fetchConfig = {
  baseUrl: `${__BASE_URL__}`,
  defaultHeaders: { 'Content-Type': 'application/json' },
}

configureSharedFetch(fetchConfig, interceptorManager)
