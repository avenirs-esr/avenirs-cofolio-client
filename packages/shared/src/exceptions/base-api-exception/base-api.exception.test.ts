import type { ErrorCode } from '@avenirs-esr/shared'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { BaseApiException, ErrorCodes } from '@avenirs-esr/shared'
import { afterEach, beforeEach, expect, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

BddTest().given('the shared BaseApiException constructor and static guard', () => {
  BddTest().when('only a message is supplied', () => {
    let exception: BaseApiException

    beforeEach(() => {
      exception = new BaseApiException('Default failure')
    })

    BddTest().then('it is an Error with the original defaults, name and prototype', () => {
      expect(exception).toBeInstanceOf(Error)
      expect(exception).toBeInstanceOf(BaseApiException)
      expect(Object.getPrototypeOf(exception)).toBe(BaseApiException.prototype)
      expect(exception).toMatchObject({ message: 'Default failure', name: 'BaseApiException', status: 500, code: ErrorCodes.UNKNOWN })
      expect(exception.method).toBeUndefined()
      expect(exception.details).toBeUndefined()
      expect(exception.stack).toContain('Default failure')
      expect(BaseApiException.isBaseApiError(exception)).toBe(true)
    })
  })

  BddTest().when('all constructor fields are supplied including status zero', () => {
    const details = { reason: 'offline', attempts: [1, 2] }
    const code: ErrorCode = ErrorCodes.CONFIGURATION_ERROR
    let exception: BaseApiException

    beforeEach(() => {
      exception = new BaseApiException('', 0, code, 'POST', details)
    })

    BddTest().then('it preserves falsy values and the details reference', () => {
      expect(exception.message).toBe('')
      expect(exception.status).toBe(0)
      expect(exception.code).toBe(code)
      expect(exception.method).toBe('POST')
      expect(exception.details).toBe(details)
    })
  })

  for (const candidate of [new Error('ordinary'), { name: 'BaseApiException', message: 'shape', status: 500, code: ErrorCodes.UNKNOWN }, null, undefined, 'failure', 500]) {
    BddTest().when(`the static guard receives ${String(candidate)}`, () => {
      let result: boolean

      beforeEach(() => {
        result = BaseApiException.isBaseApiError(candidate)
      })

      BddTest().then('it rejects values that are not BaseApiException instances', () => {
        expect(result).toBe(false)
      })
    })
  }
})
