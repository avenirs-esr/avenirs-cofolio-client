import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { BaseApiErrorCode, BaseApiException, createBasApiExceptionFromResponseBody, createBaseApiExceptionFromUnknownError, ErrorCodes } from '@avenirs-esr/shared'
import { afterEach, beforeEach, expect, vi } from 'vitest'

function inheritedMessage () {
  class InheritedMessage {
    get message () {
      return 'inherited message'
    }
  }

  return new InheritedMessage()
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

BddTest().given('conversion of API response errors', () => {
  const statuses = [
    { status: 500, code: BaseApiErrorCode.SERVER },
    { status: 503, code: BaseApiErrorCode.SERVER },
    { status: 599, code: BaseApiErrorCode.SERVER },
    { status: 404, code: BaseApiErrorCode.NOT_FOUND },
    { status: 403, code: BaseApiErrorCode.FORBIDDEN },
    { status: 401, code: BaseApiErrorCode.UNAUTHORIZED },
    { status: 400, code: BaseApiErrorCode.BAD_REQUEST },
    { status: 402, code: BaseApiErrorCode.BAD_REQUEST },
    { status: 499, code: BaseApiErrorCode.BAD_REQUEST },
    { status: 0, code: BaseApiErrorCode.NETWORK },
    { status: 200, code: BaseApiErrorCode.UNKNOWN },
    { status: 302, code: BaseApiErrorCode.UNKNOWN },
    { status: 399, code: BaseApiErrorCode.UNKNOWN },
  ]

  for (const scenario of statuses) {
    BddTest().when(`status ${scenario.status} has an unrecognized body`, () => {
      let exception: BaseApiException
      let response: Response

      beforeEach(() => {
        response = scenario.status === 0 ? Response.error() : new Response(null, { status: scenario.status, statusText: 'Failure' })
        exception = createBasApiExceptionFromResponseBody(response, {})
      })

      BddTest().then('it chooses the existing status category and default GET method', () => {
        expect(exception).toBeInstanceOf(BaseApiException)
        expect(exception.status).toBe(scenario.status)
        expect(exception.code).toBe(scenario.code)
        expect(exception.message).toBe(`HTTP ${response.status}: ${response.statusText}`)
        expect(exception.method).toBe('GET')
        expect(exception.details).toBeUndefined()
      })
    })

    BddTest().when(`a valid API body reports status ${scenario.status}`, () => {
      const details = { preserve: true }
      let exception: BaseApiException

      beforeEach(() => {
        exception = createBasApiExceptionFromResponseBody(new Response(null, { status: 502 }), {
          message: 'Body message',
          status: scenario.status,
          code: ErrorCodes.USER_NOT_FOUND,
          details,
        }, 'DELETE')
      })

      BddTest().then('it preserves body metadata, except the special network code at status zero', () => {
        expect(exception.message).toBe('Body message')
        expect(exception.status).toBe(scenario.status)
        expect(exception.code).toBe(scenario.status === 0 ? BaseApiErrorCode.NETWORK : ErrorCodes.USER_NOT_FOUND)
        expect(exception.method).toBe('DELETE')
        expect(exception.details).toBe(details)
      })
    })
  }

  const malformedCases: { label: string, body: unknown, message: string }[] = [
    { label: 'null', body: null, message: 'HTTP 403: Forbidden' },
    { label: 'undefined', body: undefined, message: 'HTTP 403: Forbidden' },
    { label: 'a string', body: 'denied', message: 'HTTP 403: Forbidden' },
    { label: 'a primitive number', body: 403, message: 'HTTP 403: Forbidden' },
    { label: 'an array', body: ['denied'], message: 'HTTP 403: Forbidden' },
    { label: 'a numeric message', body: { message: 123, code: 'CUSTOM', status: 500, details: { ignored: true } }, message: 'HTTP 403: Forbidden' },
    { label: 'a missing message', body: { code: 'CUSTOM', status: 500, details: { ignored: true } }, message: 'HTTP 403: Forbidden' },
    { label: 'a missing code', body: { message: 'Legacy', status: 500, details: { ignored: true } }, message: 'Legacy' },
    { label: 'a numeric code', body: { message: 'Legacy', code: 123, status: 500, details: { ignored: true } }, message: 'Legacy' },
    { label: 'a null code', body: { message: '', code: null, status: 500, details: { ignored: true } }, message: '' },
    { label: 'an inherited message', body: inheritedMessage(), message: 'HTTP 403: Forbidden' },
  ]

  for (const scenario of malformedCases) {
    BddTest().when(`the error body contains ${scenario.label}`, () => {
      let exception: BaseApiException

      beforeEach(() => {
        exception = createBasApiExceptionFromResponseBody(new Response(null, { status: 403, statusText: 'Forbidden' }), scenario.body)
      })

      BddTest().then('it falls back to the HTTP status and ignores details unless both own string fields exist', () => {
        expect(exception.message).toBe(scenario.message)
        expect(exception.status).toBe(403)
        expect(exception.code).toBe(BaseApiErrorCode.FORBIDDEN)
        expect(exception.details).toBeUndefined()
      })
    })
  }

  const permissiveCases: { label: string, body: unknown, status: unknown, code: string, details: unknown }[] = [
    { label: 'an unknown string code', body: { message: 'Permissive', code: 'UNLISTED_CODE', status: 422, details: { reason: 'custom' } }, status: 422, code: 'UNLISTED_CODE', details: { reason: 'custom' } },
    { label: 'an empty string code and message', body: { message: '', code: '', status: 404 }, status: 404, code: '', details: undefined },
    { label: 'no status', body: { message: 'Permissive', code: 'CUSTOM' }, status: 500, code: 'CUSTOM', details: undefined },
    { label: 'an undefined status', body: { message: 'Permissive', code: 'CUSTOM', status: undefined }, status: 500, code: 'CUSTOM', details: undefined },
    { label: 'a null status', body: { message: 'Permissive', code: 'CUSTOM', status: null }, status: null, code: 'CUSTOM', details: undefined },
    { label: 'a string status and malformed details', body: { message: 'Permissive', code: 'CUSTOM', status: '503', details: ['not a record'] }, status: '503', code: 'CUSTOM', details: ['not a record'] },
    { label: 'a negative status', body: { message: 'Permissive', code: 'CUSTOM', status: -1, details: null }, status: -1, code: 'CUSTOM', details: null },
  ]

  for (const scenario of permissiveCases) {
    BddTest().when(`both own string fields are present alongside ${scenario.label}`, () => {
      let exception: BaseApiException

      beforeEach(() => {
        exception = createBasApiExceptionFromResponseBody(new Response(null, { status: 403 }), scenario.body, '')
      })

      BddTest().then('it preserves the permissive guard and constructor defaults without validating status, code or details', () => {
        expect(exception.status).toBe(scenario.status)
        expect(exception.code).toBe(scenario.code)
        expect(exception.details).toEqual(scenario.details)
        expect(exception.method).toBe('')
        expect(exception.message).toBe(scenario.label === 'an empty string code and message' ? '' : 'Permissive')
      })
    })
  }
})

BddTest().given('conversion of unknown fetch errors', () => {
  const cases: { label: string, error: unknown, message: string }[] = [
    { label: 'an Error with an own message', error: new Error('Native error'), message: 'Native error' },
    { label: 'a plain own message', error: { message: 'Plain error' }, message: 'Plain error' },
    { label: 'an empty own message', error: { message: '' }, message: '' },
    { label: 'an inherited message', error: inheritedMessage(), message: 'Error during fetch' },
    { label: 'a numeric message', error: { message: 42 }, message: 'Error during fetch' },
    { label: 'a null message', error: { message: null }, message: 'Error during fetch' },
    { label: 'a bare string', error: 'Bare error', message: 'Error during fetch' },
    { label: 'null', error: null, message: 'Error during fetch' },
    { label: 'undefined', error: undefined, message: 'Error during fetch' },
    { label: 'a BaseApiException passed directly to the conversion helper', error: new BaseApiException('Classified', 403, ErrorCodes.FORBIDDEN, 'PATCH', { ignored: true }), message: 'Classified' },
  ]

  for (const scenario of cases) {
    BddTest().when(`the unknown value is ${scenario.label}`, () => {
      let exception: BaseApiException

      beforeEach(() => {
        exception = createBaseApiExceptionFromUnknownError(scenario.error)
      })

      BddTest().then('it creates a fresh status-zero UNKNOWN exception using only an own string message', () => {
        expect(exception).toBeInstanceOf(BaseApiException)
        expect(exception).not.toBe(scenario.error)
        expect(exception.message).toBe(scenario.message)
        expect(exception.status).toBe(0)
        expect(exception.code).toBe(BaseApiErrorCode.UNKNOWN)
        expect(exception.method).toBeUndefined()
        expect(exception.details).toBeUndefined()
      })
    })
  }
})
