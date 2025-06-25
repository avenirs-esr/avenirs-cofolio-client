import type { BaseApiErrorBody } from '@/common/exceptions/types'
import { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import { BaseApiErrorCode } from '@/common/exceptions/error-codes'
import {
  createBasApiExceptionFromResponseBody,
  createBaseApiExceptionFromUnknownError
} from '@/common/exceptions/utils/utils'
import { describe } from 'vitest'

describe('exceptions utils', () => {
  describe('createBasApiExceptionFromResponseBody', () => {
    it('should create exception from valid BaseApiErrorBody', () => {
      const response = { status: 403, statusText: 'Forbidden' } as Response
      const message = 'forbidden'
      const method = 'POST'
      const errorDetails = { reason: 'you don\'t have access' }
      const errorData: BaseApiErrorBody = {
        message,
        code: BaseApiErrorCode.FORBIDDEN,
        status: 403,
        details: errorDetails
      }
      const ex = createBasApiExceptionFromResponseBody(response, errorData, method)
      expect(ex).toBeInstanceOf(BaseApiException)
      expect(ex.status).toBe(403)
      expect(ex.code).toBe(BaseApiErrorCode.FORBIDDEN)
      expect(ex.message).toBe(message)
      expect(ex.method).toBe(method)
      expect(ex.details).toEqual(errorDetails)
    })

    it('should create exception from unknown errorData', () => {
      const response = { status: 404, statusText: 'Not Found' } as Response
      const errorData = { message: 'student not found' }
      const ex = createBasApiExceptionFromResponseBody(response, errorData, 'GET')
      expect(ex).toBeInstanceOf(BaseApiException)
      expect(ex.status).toBe(404)
      expect(ex.code).toBe(BaseApiErrorCode.NOT_FOUND)
      expect(ex.message).toBe('HTTP 404: Not Found')
      expect(ex.method).toBe('GET')
      expect(ex.details).toBeUndefined()
    })
  })

  describe('createBaseApiExceptionFromUnknownError', () => {
    it('should create exception from Error instance', () => {
      const message = 'Network error'
      const error = new Error(message)
      const ex = createBaseApiExceptionFromUnknownError(error)
      expect(ex).toBeInstanceOf(BaseApiException)
      expect(ex.status).toBe(0)
      expect(ex.code).toBe(BaseApiErrorCode.UNKNOWN)
      expect(ex.message).toBe(message)
    })

    it('should create exception from non-Error', () => {
      const message = 'cannot process request'
      const ex = createBaseApiExceptionFromUnknownError({ message })
      expect(ex).toBeInstanceOf(BaseApiException)
      expect(ex.status).toBe(0)
      expect(ex.code).toBe(BaseApiErrorCode.UNKNOWN)
      expect(ex.message).toBe(message)
    })
  })

  describe('createBasApiExceptionFromResponseBody - status code mapping', () => {
    it('returns SERVER for status >= 500', () => {
      const res = { status: 500, statusText: 'Internal Server Error' } as Response
      expect(createBasApiExceptionFromResponseBody(res, {}, 'GET').code).toBe(BaseApiErrorCode.SERVER)
      expect(
        createBasApiExceptionFromResponseBody(res, { message: 'err', code: BaseApiErrorCode.FORBIDDEN, status: 500 }, 'GET').code
      ).toBe(BaseApiErrorCode.FORBIDDEN)
      expect(
        createBasApiExceptionFromResponseBody({ status: 502, statusText: 'Bad Gateway' } as Response, {}, 'GET').code
      ).toBe(BaseApiErrorCode.SERVER)
    })

    it('returns NOT_FOUND for status 404', () => {
      const res = { status: 404, statusText: 'Not Found' } as Response
      expect(createBasApiExceptionFromResponseBody(res, {}, 'GET').code).toBe(BaseApiErrorCode.NOT_FOUND)
      expect(
        createBasApiExceptionFromResponseBody(res, { message: 'err', code: BaseApiErrorCode.SERVER, status: 404 }, 'GET').code
      ).toBe(BaseApiErrorCode.SERVER)
    })

    it('returns FORBIDDEN for status 403', () => {
      const res = { status: 403, statusText: 'Forbidden' } as Response
      expect(createBasApiExceptionFromResponseBody(res, {}, 'GET').code).toBe(BaseApiErrorCode.FORBIDDEN)
      expect(
        createBasApiExceptionFromResponseBody(res, { message: 'err', code: BaseApiErrorCode.BAD_REQUEST, status: 403 }, 'GET').code
      ).toBe(BaseApiErrorCode.BAD_REQUEST)
    })

    it('returns UNAUTHORIZED for status 401', () => {
      const res = { status: 401, statusText: 'Unauthorized' } as Response
      expect(createBasApiExceptionFromResponseBody(res, {}, 'GET').code).toBe(BaseApiErrorCode.UNAUTHORIZED)
      expect(
        createBasApiExceptionFromResponseBody(res, { message: 'err', code: BaseApiErrorCode.NOT_FOUND, status: 401 }, 'GET').code
      ).toBe(BaseApiErrorCode.NOT_FOUND)
    })

    it('returns BAD_REQUEST for status >= 400 (except 401, 403, 404)', () => {
      const res = { status: 400, statusText: 'Bad Request' } as Response
      expect(createBasApiExceptionFromResponseBody(res, {}, 'GET').code).toBe(BaseApiErrorCode.BAD_REQUEST)
      expect(
        createBasApiExceptionFromResponseBody(res, { message: 'err', code: BaseApiErrorCode.SERVER, status: 400 }, 'GET').code
      ).toBe(BaseApiErrorCode.SERVER)
      expect(
        createBasApiExceptionFromResponseBody({ status: 402, statusText: 'Payment Required' } as Response, {}, 'GET').code
      ).toBe(BaseApiErrorCode.BAD_REQUEST)
    })

    it('returns NETWORK for status 0', () => {
      const res = { status: 0, statusText: 'Network Error' } as Response
      expect(createBasApiExceptionFromResponseBody(res, {}, 'GET').code).toBe(BaseApiErrorCode.NETWORK)
    })

    it('returns UNKNOWN for all other statuses', () => {
      expect(
        createBasApiExceptionFromResponseBody({ status: 302, statusText: 'Found' } as Response, { message: 'err', code: BaseApiErrorCode.FORBIDDEN, status: 302 }, 'GET').code
      ).toBe(BaseApiErrorCode.FORBIDDEN)
      expect(
        createBasApiExceptionFromResponseBody({ status: 302, statusText: 'Found' } as Response, { message: 'err', status: 302 }, 'GET').code
      ).toBe(BaseApiErrorCode.UNKNOWN)
    })
  })
})
