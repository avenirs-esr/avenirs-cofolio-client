import { createCustomFetch, FetchInterceptorManager } from '@/api/fetch'
import { BaseApiErrorCode } from '@/common/exceptions'
import { i18n } from '@/plugins/vue-i18n'
import { useToasterStore } from '@/store'
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

const fetcher = createCustomFetch({
  baseUrl: `${__BASE_URL__}`,
  defaultHeaders: { 'Content-Type': 'application/json' },
  onException: (e) => {
    if (e.code.includes('NOT_FOUND')) {
      useToasterStore().setErrorCode(BaseApiErrorCode.NOT_FOUND)
    }
  },
}, interceptorManager)

export async function customFetch<T> (url: string, options: RequestInit): Promise<T> {
  return fetcher<T>(url, options)
}
