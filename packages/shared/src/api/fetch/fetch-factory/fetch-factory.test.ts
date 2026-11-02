import type { ErrorCode, FetchConfig, FetchOptions, RequestInterceptor, ResponseInterceptor } from '@avenirs-esr/shared'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { BaseApiErrorCode, BaseApiException, createCustomFetch, ErrorCodes, FetchInterceptorManager } from '@avenirs-esr/shared'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const baseUrl = 'https://api.example.test/v1'

async function rejectionOf<T> (promise: Promise<T>): Promise<unknown> {
  return promise.then(() => undefined, (error: unknown) => error)
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

BddTest().given('the shared custom fetch public API', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockImplementation(async () => Response.json({ success: true }))
    vi.stubGlobal('fetch', fetchMock)
  })

  const urlCases = [
    { label: 'a path with a leading slash', base: baseUrl, path: '/users', expected: `${baseUrl}/users` },
    { label: 'a path without a leading slash', base: baseUrl, path: 'users', expected: `${baseUrl}/users` },
    { label: 'one trailing base slash', base: `${baseUrl}/`, path: '/users', expected: `${baseUrl}/users` },
    { label: 'multiple trailing base slashes', base: `${baseUrl}//`, path: 'users', expected: `${baseUrl}//users` },
    { label: 'an empty relative path', base: baseUrl, path: '', expected: `${baseUrl}/` },
    { label: 'an empty explicit base', base: '', path: 'users', expected: '/users' },
    { label: 'an HTTPS absolute URL', base: baseUrl, path: 'https://other.example.test/users?q=1#top', expected: 'https://other.example.test/users?q=1#top' },
    { label: 'an HTTP absolute URL', base: baseUrl, path: 'http://other.example.test/users', expected: 'http://other.example.test/users' },
    { label: 'a protocol-relative path', base: baseUrl, path: '//other.example.test/users', expected: `${baseUrl}//other.example.test/users` },
    { label: 'an uppercase protocol', base: baseUrl, path: 'HTTPS://other.example.test/users', expected: `${baseUrl}/HTTPS://other.example.test/users` },
    { label: 'a relative query and fragment', base: baseUrl, path: 'users?q=1#top', expected: `${baseUrl}/users?q=1#top` },
  ]

  for (const scenario of urlCases) {
    BddTest().when(`fetching ${scenario.label}`, () => {
      let result: { success: boolean }

      beforeEach(async () => {
        result = await createCustomFetch({ baseUrl: scenario.base })(scenario.path)
      })

      BddTest().then('it preserves the original URL joining rules', () => {
        expect(fetchMock).toHaveBeenCalledExactlyOnceWith(scenario.expected, {
          credentials: 'include',
          headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        expect(result).toEqual({ success: true })
      })
    })
  }

  const headerSources: { label: string, create: (value: string) => HeadersInit }[] = [
    { label: 'object', create: value => ({ 'X-Shared': value, [`X-${value}`]: value }) },
    { label: 'tuple', create: value => [['X-Shared', value], [`X-${value}`, value]] },
    { label: 'Headers', create: value => new Headers({ 'X-Shared': value, [`X-${value}`]: value }) },
  ]

  for (const defaults of headerSources) {
    for (const request of headerSources) {
      BddTest().when(`merging ${defaults.label} defaults with ${request.label} request headers`, () => {
        let defaultHeaders: HeadersInit
        let requestHeaders: HeadersInit
        let mergedHeaders: Headers

        beforeEach(async () => {
          defaultHeaders = defaults.create('default')
          requestHeaders = request.create('request')
          await createCustomFetch({ baseUrl, defaultHeaders })('/headers', { headers: requestHeaders })
          mergedHeaders = new Headers(fetchMock.mock.calls[0]?.[1]?.headers)
        })

        BddTest().then('it appends Headers values but sets object and tuple values without mutating either source', () => {
          expect(mergedHeaders.get('x-shared')).toBe(request.label === 'Headers' ? 'default, request' : 'request')
          expect(mergedHeaders.get('x-default')).toBe('default')
          expect(mergedHeaders.get('x-request')).toBe('request')
          expect(mergedHeaders.has('content-type')).toBe(false)
          expect(new Headers(defaultHeaders).get('x-shared')).toBe('default')
          expect(new Headers(defaultHeaders).has('x-request')).toBe(false)
          expect(new Headers(requestHeaders).get('x-shared')).toBe('request')
          expect(new Headers(requestHeaders).has('x-default')).toBe(false)
        })
      })
    }
  }

  BddTest().when('request tuples repeat a header with different casing', () => {
    let headers: Headers

    beforeEach(async () => {
      await createCustomFetch({ baseUrl })('/headers', {
        headers: [['Content-Type', 'text/plain'], ['content-type', 'application/xml']],
      })
      headers = new Headers(fetchMock.mock.calls[0]?.[1]?.headers)
    })

    BddTest().then('the last tuple replaces both the default and earlier tuple values', () => {
      expect(headers.get('content-type')).toBe('application/xml')
    })
  })

  BddTest().when('explicit empty defaults are configured', () => {
    let headers: Headers

    beforeEach(async () => {
      await createCustomFetch({ baseUrl, defaultHeaders: {} })('/headers')
      headers = new Headers(fetchMock.mock.calls[0]?.[1]?.headers)
    })

    BddTest().then('it does not reintroduce the factory default content type', () => {
      expect([...headers]).toEqual([])
    })
  })

  for (const credentials of ['include', 'omit', 'same-origin'] satisfies RequestCredentials[]) {
    BddTest().when(`credentials are explicitly ${credentials}`, () => {
      beforeEach(async () => {
        await createCustomFetch({ baseUrl })('/credentials', { credentials })
      })

      BddTest().then('it preserves the requested credential policy', () => {
        expect(fetchMock.mock.calls[0]?.[1]?.credentials).toBe(credentials)
      })
    })
  }

  BddTest().when('fetch options include a body and additional request settings', () => {
    const controller = new AbortController()
    const options: FetchOptions = {
      method: 'PATCH',
      body: '{"name":"Ada"}',
      cache: 'no-store',
      redirect: 'manual',
      signal: controller.signal,
      keepalive: true,
      skipUnauthorizedHandling: true,
      headers: { 'X-Request': 'original' },
    }
    let originalOptions: FetchOptions

    beforeEach(async () => {
      originalOptions = { ...options }
      await createCustomFetch({ baseUrl })('/users/1', options)
    })

    BddTest().then('it forwards options, defaults credentials, and does not mutate the input', () => {
      expect(fetchMock.mock.calls[0]?.[1]).toEqual({
        ...options,
        credentials: 'include',
        headers: new Headers({ 'Content-Type': 'application/json', 'X-Request': 'original' }),
      })
      expect(fetchMock.mock.calls[0]?.[1]?.signal).toBe(controller.signal)
      expect(options).toEqual(originalOptions)
      expect(options.headers).toBe(originalOptions.headers)
      expect(options.credentials).toBeUndefined()
    })
  })

  BddTest().when('a FormData body is submitted with explicit request headers', () => {
    let body: FormData
    let headers: Headers

    beforeEach(async () => {
      body = new FormData()
      body.append('title', 'attachment')
      await createCustomFetch({
        baseUrl,
        defaultHeaders: { 'Content-Type': 'application/json', 'Authorization': 'default-token', 'X-Default': 'default' },
      })('/upload', {
        method: 'POST',
        body,
        headers: { 'X-Request': 'request', 'Content-Type': 'multipart/custom' },
      })
      headers = new Headers(fetchMock.mock.calls[0]?.[1]?.headers)
    })

    BddTest().then('it skips every default header rather than only content type and preserves explicit headers', () => {
      expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(body)
      expect(headers).toEqual(new Headers({ 'X-Request': 'request', 'Content-Type': 'multipart/custom' }))
      expect(headers.has('authorization')).toBe(false)
      expect(headers.has('x-default')).toBe(false)
    })
  })

  BddTest().when('a FormData body has no explicit content type', () => {
    let headers: Headers

    beforeEach(async () => {
      await createCustomFetch({ baseUrl })('/upload', { method: 'POST', body: new FormData() })
      headers = new Headers(fetchMock.mock.calls[0]?.[1]?.headers)
    })

    BddTest().then('it leaves content type unset for the native fetch boundary', () => {
      expect([...headers]).toEqual([])
    })
  })

  for (const createsFormData of [true, false]) {
    BddTest().when(`an interceptor ${createsFormData ? 'introduces' : 'replaces'} a FormData body`, () => {
      const manager = new FetchInterceptorManager()
      const interceptor = vi.fn<RequestInterceptor>()
      let interceptedBody: BodyInit

      beforeEach(async () => {
        interceptedBody = createsFormData ? new FormData() : 'plain body'
        interceptor.mockReturnValue({ body: interceptedBody })
        manager.addRequestInterceptor(interceptor)
        await createCustomFetch({ baseUrl }, manager)('/upload', {
          body: createsFormData ? 'original body' : new FormData(),
        })
      })

      BddTest().then('it chooses default headers from the intercepted body', () => {
        expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(interceptedBody)
        expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get('content-type')).toBe(
          createsFormData ? null : 'application/json',
        )
      })
    })
  }

  const jsonCases: { label: string, headers: HeadersInit }[] = [
    { label: 'application/json', headers: { 'Content-Type': 'application/json' } },
    { label: 'mixed-case JSON with parameters', headers: { 'Content-Type': 'Application/JSON; Charset=UTF-8' } },
    { label: 'structured +json', headers: { 'Content-Type': 'application/problem+json' } },
    { label: 'non-application +json', headers: { 'Content-Type': 'model/example+json' } },
    { label: 'JSON with attachment disposition', headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename=payload.json' } },
    { label: 'application/xml fallback', headers: { 'Content-Type': 'application/xml' } },
    { label: 'unrecognized content type fallback', headers: { 'Content-Type': 'model/example' } },
    { label: 'missing content type fallback', headers: {} },
  ]

  for (const scenario of jsonCases) {
    BddTest().when(`a successful response uses ${scenario.label}`, () => {
      let result: { items: number[] }

      beforeEach(async () => {
        const body = new TextEncoder().encode('{"items":[1,2]}')
        fetchMock.mockResolvedValueOnce(new Response(body, { headers: scenario.headers }))
        result = await createCustomFetch({ baseUrl })('/body')
      })

      BddTest().then('it parses JSON, including the existing XML fallback behavior', () => {
        expect(result).toEqual({ items: [1, 2] })
      })
    })
  }

  for (const contentType of ['text/plain', 'text/html; charset=utf-8', 'TEXT/XML']) {
    BddTest().when(`a successful response uses ${contentType}`, () => {
      let result: string

      beforeEach(async () => {
        fetchMock.mockResolvedValueOnce(new Response('<value>text</value>', { headers: { 'Content-Type': contentType } }))
        result = await createCustomFetch({ baseUrl })('/body')
      })

      BddTest().then('it returns text without attempting JSON parsing', () => {
        expect(result).toBe('<value>text</value>')
      })
    })
  }

  const binaryCases = [
    { label: 'image', contentType: 'image/png', disposition: '' },
    { label: 'audio', contentType: 'audio/mpeg', disposition: '' },
    { label: 'video', contentType: 'video/mp4', disposition: '' },
    { label: 'PDF', contentType: 'application/pdf', disposition: '' },
    { label: 'octet stream', contentType: 'application/octet-stream', disposition: '' },
    { label: 'text attachment', contentType: 'text/plain', disposition: 'Attachment; filename=notes.txt' },
    { label: 'untyped attachment', contentType: '', disposition: 'attachment' },
    { label: 'XML attachment', contentType: 'application/xml', disposition: 'attachment' },
  ]

  for (const scenario of binaryCases) {
    BddTest().when(`a successful response contains ${scenario.label}`, () => {
      let result: Blob
      let bytes: number[]

      beforeEach(async () => {
        const headers = new Headers()
        if (scenario.contentType) {
          headers.set('content-type', scenario.contentType)
        }
        if (scenario.disposition) {
          headers.set('content-disposition', scenario.disposition)
        }
        fetchMock.mockResolvedValueOnce(new Response(new Uint8Array([0, 1, 127, 255]), { headers }))
        result = await createCustomFetch({ baseUrl })('/binary')
        bytes = [...new Uint8Array(await result.arrayBuffer())]
      })

      BddTest().then('it returns a native Blob preserving bytes and media type', () => {
        expect(result).toBeInstanceOf(Blob)
        expect(result.type).toBe(scenario.contentType)
        expect(result.size).toBe(4)
        expect(bytes).toEqual([0, 1, 127, 255])
      })
    })
  }

  const emptyCases: { label: string, response: () => Response }[] = [
    { label: '204 without a length header', response: () => new Response(null, { status: 204 }) },
    { label: '204 with a nonzero declared length', response: () => new Response(null, { status: 204, headers: { 'content-length': '10' } }) },
    { label: 'zero content length with an invalid JSON body', response: () => new Response('not json', { headers: { 'content-length': '0', 'content-type': 'application/json' } }) },
  ]

  for (const scenario of emptyCases) {
    BddTest().when(`a response has ${scenario.label}`, () => {
      let response: Response
      let result: unknown

      beforeEach(async () => {
        response = scenario.response()
        fetchMock.mockResolvedValueOnce(response)
        result = await createCustomFetch({ baseUrl })('/empty')
      })

      BddTest().then('it resolves undefined without consuming the body', () => {
        expect(result).toBeUndefined()
        expect(response.bodyUsed).toBe(false)
      })
    })
  }

  for (const contentType of ['application/json', 'application/xml', '']) {
    BddTest().when(`invalid JSON reaches the ${contentType || 'missing content type'} parser`, () => {
      let failure: unknown

      beforeEach(async () => {
        fetchMock.mockResolvedValueOnce(new Response(new TextEncoder().encode('<xml/>'), {
          headers: contentType ? { 'Content-Type': contentType } : {},
        }))
        failure = await rejectionOf(createCustomFetch({ baseUrl })('/malformed'))
      })

      BddTest().then('it converts the parse failure to status zero UNKNOWN rather than a binary or XML result', () => {
        expect(failure).toBeInstanceOf(BaseApiException)
        expect(failure).toMatchObject({ status: 0, code: BaseApiErrorCode.UNKNOWN, name: 'BaseApiException' })
      })
    })
  }

  BddTest().when('a non-OK response includes a valid API error body', () => {
    const code: ErrorCode = ErrorCodes.USER_NOT_FOUND
    const details = { field: 'user', context: { id: 'missing' } }
    let response: Response
    let failure: unknown

    beforeEach(async () => {
      response = Response.json({ message: 'No such user', status: 409, code, details }, { status: 502 })
      fetchMock.mockResolvedValueOnce(response)
      failure = await rejectionOf(createCustomFetch({ baseUrl })('/users', { method: 'PATCH' }))
    })

    BddTest().then('it preserves the body status, API code, details and actual request method while parsing a clone', () => {
      expect(failure).toBeInstanceOf(BaseApiException)
      expect(failure).toMatchObject({ message: 'No such user', status: 409, code, method: 'PATCH', details })
      expect(response.bodyUsed).toBe(false)
    })
  })

  BddTest().when('a legacy error response omits a request method and API code', () => {
    let failure: unknown

    beforeEach(async () => {
      fetchMock.mockResolvedValueOnce(Response.json({ message: 'Legacy denial', status: 503, details: { ignored: true } }, { status: 403 }))
      failure = await rejectionOf(createCustomFetch({ baseUrl })('/legacy'))
    })

    BddTest().then('it uses the response status, the default GET method, and no details', () => {
      expect(failure).toMatchObject({ message: 'Legacy denial', status: 403, code: BaseApiErrorCode.FORBIDDEN, method: 'GET' })
      expect(failure).toHaveProperty('details', undefined)
    })
  })

  for (const scenario of [
    { label: 'plain-text', response: () => new Response('plain failure', { status: 400, statusText: 'Bad Request', headers: { 'Content-Type': 'text/plain' } }) },
    { label: 'binary', response: () => new Response('binary failure', { status: 400, statusText: 'Bad Request', headers: { 'Content-Type': 'application/pdf' } }) },
    { label: 'empty', response: () => new Response(null, { status: 400, statusText: 'Bad Request', headers: { 'content-length': '0' } }) },
  ]) {
    BddTest().when(`a non-OK ${scenario.label} response has no usable message`, () => {
      let failure: unknown

      beforeEach(async () => {
        fetchMock.mockResolvedValueOnce(scenario.response())
        failure = await rejectionOf(createCustomFetch({ baseUrl })('/failure'))
      })

      BddTest().then('it falls back to the HTTP status and status text', () => {
        expect(failure).toMatchObject({ message: 'HTTP 400: Bad Request', status: 400, code: BaseApiErrorCode.BAD_REQUEST, method: 'GET' })
      })
    })
  }

  BddTest().when('a non-OK response itself contains invalid JSON', () => {
    let failure: unknown

    beforeEach(async () => {
      fetchMock.mockResolvedValueOnce(new Response('invalid', { status: 503, headers: { 'Content-Type': 'application/json' } }))
      failure = await rejectionOf(createCustomFetch({ baseUrl })('/invalid-error'))
    })

    BddTest().then('it retains the existing parse-error conversion instead of reporting the HTTP status', () => {
      expect(failure).toBeInstanceOf(BaseApiException)
      expect(failure).toMatchObject({ status: 0, code: BaseApiErrorCode.UNKNOWN })
    })
  })

  for (const scenario of [
    { label: 'a native network Error', error: new TypeError('Failed to fetch'), message: 'Failed to fetch' },
    { label: 'a plain error object', error: { message: 'Disconnected' }, message: 'Disconnected' },
    { label: 'a string rejection', error: 'Disconnected', message: 'Error during fetch' },
    { label: 'a null rejection', error: null, message: 'Error during fetch' },
  ]) {
    BddTest().when(`native fetch rejects with ${scenario.label}`, () => {
      let failure: unknown

      beforeEach(async () => {
        fetchMock.mockRejectedValueOnce(scenario.error)
        failure = await rejectionOf(createCustomFetch({ baseUrl })('/network'))
      })

      BddTest().then('it converts the rejection to UNKNOWN with status zero, not NETWORK', () => {
        expect(failure).toBeInstanceOf(BaseApiException)
        expect(failure).toMatchObject({ message: scenario.message, status: 0, code: BaseApiErrorCode.UNKNOWN })
        expect(failure).toHaveProperty('method', undefined)
        expect(failure).toHaveProperty('details', undefined)
      })
    })
  }

  for (const stage of ['fetch', 'request', 'response'] as const) {
    BddTest().when(`a BaseApiException is thrown by the ${stage} stage`, () => {
      const details = { cause: 'known', nested: { preserve: true } }
      const code: ErrorCode = ErrorCodes.ACCESS_DENIED
      const exception = new BaseApiException('Already classified', 418, code, 'DELETE', details)
      const manager = new FetchInterceptorManager()
      const requestInterceptor = vi.fn<RequestInterceptor>()
      const responseInterceptor = vi.fn<ResponseInterceptor>()
      let failure: unknown

      beforeEach(async () => {
        if (stage === 'fetch') {
          fetchMock.mockRejectedValueOnce(exception)
        }
        if (stage === 'request') {
          requestInterceptor.mockImplementation(() => {
            throw exception
          })
          manager.addRequestInterceptor(requestInterceptor)
        }
        if (stage === 'response') {
          responseInterceptor.mockRejectedValueOnce(exception)
          manager.addResponseInterceptor(responseInterceptor)
        }
        failure = await rejectionOf(createCustomFetch({ baseUrl }, manager)('/known'))
      })

      BddTest().then('it rethrows the identical exception with all metadata untouched', () => {
        expect(failure).toBe(exception)
        expect(exception.status).toBe(418)
        expect(exception.code).toBe(code)
        expect(exception.details).toBe(details)
        expect(exception.method).toBe('DELETE')
        expect(exception.message).toBe('Already classified')
        expect(fetchMock).toHaveBeenCalledTimes(stage === 'request' ? 0 : 1)
      })
    })
  }

  for (const stage of ['request', 'response'] as const) {
    BddTest().when(`the ${stage} interceptor throws an unclassified Error`, () => {
      const manager = new FetchInterceptorManager()
      const requestInterceptor = vi.fn<RequestInterceptor>()
      const responseInterceptor = vi.fn<ResponseInterceptor>()
      let failure: unknown

      beforeEach(async () => {
        if (stage === 'request') {
          requestInterceptor.mockImplementation(() => {
            throw new Error('Request interceptor failed')
          })
          manager.addRequestInterceptor(requestInterceptor)
        }
        else {
          responseInterceptor.mockRejectedValueOnce(new Error('Response interceptor failed'))
          manager.addResponseInterceptor(responseInterceptor)
        }
        failure = await rejectionOf(createCustomFetch({ baseUrl }, manager)('/interceptor-failure'))
      })

      BddTest().then('it converts interceptor failures and does not continue a failed request', () => {
        expect(failure).toBeInstanceOf(BaseApiException)
        expect(failure).toMatchObject({
          message: stage === 'request' ? 'Request interceptor failed' : 'Response interceptor failed',
          status: 0,
          code: BaseApiErrorCode.UNKNOWN,
        })
        expect(fetchMock).toHaveBeenCalledTimes(stage === 'request' ? 0 : 1)
      })
    })
  }

  BddTest().when('synchronous and asynchronous interceptors surround a fetch', () => {
    let manager: FetchInterceptorManager
    const config = { baseUrl: `${baseUrl}/`, defaultHeaders: { 'X-Default': 'default' } } satisfies FetchConfig
    const options: RequestInit = { method: 'GET', headers: { 'X-Original': 'original' } }
    const requestOne = vi.fn<RequestInterceptor>()
    const requestTwo = vi.fn<RequestInterceptor>()
    const responseOne = vi.fn<ResponseInterceptor>()
    const responseTwo = vi.fn<ResponseInterceptor>()
    let firstOptions: RequestInit
    let secondOptions: RequestInit
    let originalResponse: Response
    let replacementResponse: Response
    let finalResponse: Response
    let result: { final: boolean }

    beforeEach(async () => {
      manager = new FetchInterceptorManager()
      requestOne.mockReset()
      requestTwo.mockReset()
      responseOne.mockReset()
      responseTwo.mockReset()
      firstOptions = { ...options, method: 'POST', body: 'intercepted' }
      secondOptions = { ...firstOptions, headers: { 'X-Request': 'intercepted' }, credentials: 'omit' }
      originalResponse = Response.json({ original: true }, { status: 403 })
      replacementResponse = Response.json({ replaced: true }, { status: 500 })
      finalResponse = Response.json({ final: true })
      requestOne.mockReturnValue(firstOptions)
      requestTwo.mockResolvedValue(secondOptions)
      responseOne.mockReturnValue(replacementResponse)
      responseTwo.mockResolvedValue(finalResponse)
      manager.addRequestInterceptor(requestOne)
      manager.addRequestInterceptor(requestTwo)
      manager.addResponseInterceptor(responseOne)
      manager.addResponseInterceptor(responseTwo)
      fetchMock.mockResolvedValueOnce(originalResponse)
      result = await createCustomFetch(config, manager)('intercepted', options)
    })

    BddTest().then('it chains intercepted values in registration order before checking the final response status', () => {
      expect(requestOne).toHaveBeenCalledExactlyOnceWith('intercepted', options, config)
      expect(requestOne.mock.calls[0]?.[1]).not.toBe(options)
      expect(requestTwo).toHaveBeenCalledExactlyOnceWith('intercepted', firstOptions, config)
      expect(requestTwo.mock.calls[0]?.[1]).toBe(firstOptions)
      expect(requestOne.mock.invocationCallOrder[0]).toBeLessThan(requestTwo.mock.invocationCallOrder[0] ?? 0)
      expect(requestTwo.mock.invocationCallOrder[0]).toBeLessThan(fetchMock.mock.invocationCallOrder[0] ?? 0)
      expect(fetchMock.mock.invocationCallOrder[0]).toBeLessThan(responseOne.mock.invocationCallOrder[0] ?? 0)
      expect(responseOne.mock.invocationCallOrder[0]).toBeLessThan(responseTwo.mock.invocationCallOrder[0] ?? 0)
      expect(responseOne.mock.calls[0]?.[0]).toBe(originalResponse)
      expect(responseTwo.mock.calls[0]?.[0]).toBe(replacementResponse)
      expect(result).toEqual({ final: true })
      expect(originalResponse.bodyUsed).toBe(false)
      expect(replacementResponse.bodyUsed).toBe(false)
      expect(finalResponse.bodyUsed).toBe(true)
    })

    BddTest().then('response interceptors receive the same fully resolved context and unchanged config identity', () => {
      const context = responseOne.mock.calls[0]?.[1]
      expect(context).toEqual({
        url: `${baseUrl}/intercepted`,
        config,
        options: {
          method: 'POST',
          body: 'intercepted',
          credentials: 'omit',
          headers: new Headers({ 'X-Default': 'default', 'X-Request': 'intercepted' }),
        },
      })
      expect(context?.config).toBe(config)
      expect(context?.options).toBe(fetchMock.mock.calls[0]?.[1])
      expect(responseTwo.mock.calls[0]?.[1]).toBe(context)
      expect(options).toEqual({ method: 'GET', headers: { 'X-Original': 'original' } })
    })
  })

  BddTest().when('a response interceptor replaces a successful response with an API failure', () => {
    const manager = new FetchInterceptorManager()
    const interceptor = vi.fn<ResponseInterceptor>()
    let failure: unknown

    beforeEach(async () => {
      interceptor.mockResolvedValueOnce(Response.json({ message: 'Intercepted failure', code: ErrorCodes.ACCESS_DENIED, status: 401 }, { status: 403 }))
      manager.addResponseInterceptor(interceptor)
      failure = await rejectionOf(createCustomFetch({ baseUrl }, manager)('/replacement', { method: 'PUT' }))
    })

    BddTest().then('it derives the exception from the replacement rather than the original successful response', () => {
      expect(failure).toMatchObject({ message: 'Intercepted failure', code: ErrorCodes.ACCESS_DENIED, status: 401, method: 'PUT' })
    })
  })
})
