import type { DefaultBodyType, StrictRequest } from 'msw'
import { ErrorCodes } from '#shared/exceptions/error-codes'
import { HttpStatusCode } from '#shared/api/http-status'
import { createEmptyPaginatedDatasetResponse, getOptionalBooleanSearchParam, internalServerError, isEmptyDataSetRequest, successJsonResponse } from '#shared/test-utils/msw/index'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('the empty dataset request helper', () => {
  for (const { label, headers, expected } of [
    { label: 'the empty dataset header is absent', headers: {}, expected: false },
    { label: 'an unrelated header is present', headers: { 'x-other-header': 'true' }, expected: false },
    { label: 'the empty dataset header is true', headers: { 'x-dataset-empty': 'true' }, expected: true },
    { label: 'the empty dataset header is false', headers: { 'x-dataset-empty': 'false' }, expected: true },
    { label: 'the empty dataset header has an empty value', headers: { 'x-dataset-empty': '' }, expected: true },
    { label: 'the empty dataset header uses mixed casing', headers: { 'X-Dataset-Empty': 'true' }, expected: true },
  ] satisfies { label: string, headers: HeadersInit, expected: boolean }[]) {
    BddTest().when(label, () => {
      let result: boolean

      beforeEach(() => {
        const request = new Request('https://example.com/datasets', { headers }) as StrictRequest<DefaultBodyType>
        result = isEmptyDataSetRequest(request)
      })

      BddTest().then(`it returns ${expected} based on header presence`, () => {
        expect(result).toBe(expected)
      })
    })
  }
})

BddTest().given('the empty paginated dataset response helper', () => {
  let response: ReturnType<typeof createEmptyPaginatedDatasetResponse>

  beforeEach(() => {
    response = createEmptyPaginatedDatasetResponse()
  })

  BddTest().when('an empty paginated response is created', () => {
    BddTest().then('it returns a successful HTTP status', () => {
      expect(response?.status).toBe(HttpStatusCode.OK)
    })

    BddTest().then('it declares JSON content', () => {
      expect(response?.headers.get('Content-Type')).toBe('application/json')
    })

    BddTest().then('it contains an empty dataset with the default pagination', async () => {
      expect(await response?.json()).toEqual({
        data: [],
        page: {
          pageSize: 4,
          totalElements: 0,
          totalPages: 0,
          page: 0,
        },
      })
    })
  })
})

BddTest().given('the optional boolean search parameter helper', () => {
  for (const { label, search, name, expected } of [
    { label: 'the parameter is absent', search: '', name: 'isAssociated', expected: undefined },
    { label: 'only another parameter is present', search: '?other=true', name: 'isAssociated', expected: undefined },
    { label: 'the parameter is true', search: '?isAssociated=true', name: 'isAssociated', expected: true },
    { label: 'the parameter is false', search: '?isAssociated=false', name: 'isAssociated', expected: false },
    { label: 'the parameter has an empty value', search: '?isAssociated=', name: 'isAssociated', expected: false },
    { label: 'the parameter has no equals sign', search: '?isAssociated', name: 'isAssociated', expected: false },
    { label: 'the parameter value has different casing', search: '?isAssociated=True', name: 'isAssociated', expected: false },
    { label: 'the parameter has a numeric value', search: '?isAssociated=1', name: 'isAssociated', expected: false },
    { label: 'the parameter has an unexpected value', search: '?isAssociated=invalid', name: 'isAssociated', expected: false },
    { label: 'the parameter value has surrounding whitespace', search: '?isAssociated=%20true%20', name: 'isAssociated', expected: false },
    { label: 'a different parameter name is requested', search: '?isAssociated=false&enabled=true', name: 'enabled', expected: true },
    { label: 'the parameter name has different casing', search: '?IsAssociated=true', name: 'isAssociated', expected: undefined },
    { label: 'the first repeated parameter is true', search: '?isAssociated=true&isAssociated=false', name: 'isAssociated', expected: true },
    { label: 'the first repeated parameter is false', search: '?isAssociated=false&isAssociated=true', name: 'isAssociated', expected: false },
  ]) {
    BddTest().when(label, () => {
      let result: boolean | undefined

      beforeEach(() => {
        const url = new URL(`https://example.com/datasets${search}`)
        result = getOptionalBooleanSearchParam(url, name)
      })

      BddTest().then(`it returns ${expected}`, () => {
        expect(result).toBe(expected)
      })
    })
  }
})

BddTest().given('the internal server error response helper', () => {
  let response: ReturnType<typeof internalServerError>

  beforeEach(() => {
    response = internalServerError()
  })

  BddTest().when('an internal server error response is created', () => {
    BddTest().then('it returns an internal server error HTTP status', () => {
      expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR)
    })

    BddTest().then('it declares JSON content', () => {
      expect(response.headers.get('Content-Type')).toBe('application/json')
    })

    BddTest().then('it contains the server error message and code', async () => {
      expect(await response.json()).toEqual({
        message: 'Internal Server Error',
        code: ErrorCodes.SERVER,
      })
    })
  })
})

BddTest().given('the success JSON response helper', () => {
  const data = { id: 'dataset-1', name: 'Dataset' }
  let response: ReturnType<typeof successJsonResponse>

  beforeEach(() => {
    response = successJsonResponse(data)
  })

  BddTest().when('a success JSON response is created', () => {
    BddTest().then('it returns a successful HTTP status', () => {
      expect(response.status).toBe(HttpStatusCode.OK)
    })

    BddTest().then('it declares JSON content', () => {
      expect(response.headers.get('Content-Type')).toBe('application/json')
    })

    BddTest().then('it contains the given data', async () => {
      expect(await response.json()).toEqual(data)
    })
  })
})
