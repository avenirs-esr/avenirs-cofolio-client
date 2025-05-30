import { BaseApiErrorCode } from '@/common/exceptions/error-codes'
import { describe, expect, it } from 'vitest'
import { BaseApiException } from './base-api.exception'

describe('baseApiException', () => {
  it('should construct with all properties', () => {
    const errorDetails = { name: 'name is required' }
    const err = new BaseApiException('msg', 404, BaseApiErrorCode.NOT_FOUND, 'GET', errorDetails)
    expect(err.message).toBe('msg')
    expect(err.status).toBe(404)
    expect(err.code).toBe(BaseApiErrorCode.NOT_FOUND)
    expect(err.method).toBe('GET')
    expect(err.details).toEqual(errorDetails)
    expect(err.name).toBe('BaseApiException')
  })

  it('should detect BaseApiException with isBaseApiError', () => {
    const ex = new BaseApiException('Unknown student id')
    expect(BaseApiException.isBaseApiError(ex)).toBe(true)
    expect(BaseApiException.isBaseApiError({})).toBe(false)
  })
})
