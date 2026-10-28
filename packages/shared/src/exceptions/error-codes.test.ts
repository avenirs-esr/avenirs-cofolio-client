import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { BaseApiErrorCode, ErrorCodes } from '@avenirs-esr/shared'
import { afterEach, expect, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

BddTest().given('the shared runtime constants', () => {
  BddTest().when('the error-code public entry point is imported', () => {
    BddTest().then('it exposes base categories and API codes through the combined public constants', () => {
      expect(BaseApiErrorCode).toEqual({
        UNKNOWN: 'UNKNOWN_ERROR',
        NETWORK: 'NETWORK_ERROR',
        BAD_REQUEST: 'BAD_REQUEST',
        UNAUTHORIZED: 'UNAUTHORIZED',
        FORBIDDEN: 'FORBIDDEN',
        NOT_FOUND: 'NOT_FOUND',
        SERVER: 'SERVER_ERROR',
      })
      expect(ErrorCodes).toMatchObject(BaseApiErrorCode)
      expect(ErrorCodes.USER_NOT_FOUND).toBe('USER_NOT_FOUND')
      expect(ErrorCodes.ACCESS_DENIED).toBe('ACCESS_DENIED')
      expect(ErrorCodes.CONFIGURATION_ERROR).toBe('CONFIGURATION_ERROR')
    })
  })
})
