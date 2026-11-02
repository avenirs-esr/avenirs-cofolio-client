import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { setupWarningHandler } from '@avenirs-esr/shared/test-utils/unit'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const initialWarn = console.warn
const originalWarn = vi.fn<(...args: unknown[]) => void>()

beforeEach(() => {
  originalWarn.mockReset()
  console.warn = originalWarn
})

afterEach(() => {
  console.warn = initialWarn
})

BddTest().given('the shared warning handler', () => {
  BddTest().when('an ordinary warning is emitted after installation', () => {
    const detail = { code: 17 }

    beforeEach(() => {
      setupWarningHandler()
      console.warn('ordinary warning', detail, 42, undefined)
    })

    BddTest().then('it forwards every original argument without conversion', () => {
      expect(originalWarn).toHaveBeenCalledExactlyOnceWith('ordinary warning', detail, 42, undefined)
      expect(originalWarn.mock.calls[0][1]).toBe(detail)
    })
  })

  for (const prefix of ['[Vue warn]', '[intlify]']) {
    BddTest().when(`${prefix} appears inside stringified warning arguments`, () => {
      beforeEach(() => {
        setupWarningHandler()
      })

      BddTest().then('it throws the exact error without forwarding the warning', () => {
        const detail = { toString: () => `context ${prefix} detail` }

        expect(() => console.warn(null, detail, Symbol('value'), undefined, 17)).toThrowError(
          new Error(`❌ Vue warning detected during test:\nnull context ${prefix} detail Symbol(value) undefined 17`),
        )
        expect(originalWarn).not.toHaveBeenCalled()
      })
    })

    BddTest().when(`${prefix} contains an explicitly ignored substring`, () => {
      const detail = { toString: () => `${prefix} allowed detail` }

      beforeEach(() => {
        setupWarningHandler(['not present', 'allowed'])
        console.warn('context', detail, 17)
      })

      BddTest().then('it delegates the original arguments exactly once', () => {
        expect(originalWarn).toHaveBeenCalledExactlyOnceWith('context', detail, 17)
        expect(originalWarn.mock.calls[0][1]).toBe(detail)
      })
    })

    BddTest().when(`${prefix} does not match the supplied ignored substring`, () => {
      beforeEach(() => {
        setupWarningHandler(['allowed'])
      })

      BddTest().then('it still fails the warning instead of ignoring all warnings', () => {
        expect(() => console.warn(`${prefix} forbidden`)).toThrowError(
          new Error(`❌ Vue warning detected during test:\n${prefix} forbidden`),
        )
        expect(originalWarn).not.toHaveBeenCalled()
      })
    })
  }

  BddTest().when('a warning is empty or only resembles a failing prefix', () => {
    beforeEach(() => {
      setupWarningHandler()
      console.warn()
      console.warn('Vue warn', '[vue warn]', 'intlify', '[intlify')
    })

    BddTest().then('it preserves empty arguments and exact case-sensitive prefix matching', () => {
      expect(originalWarn.mock.calls).toEqual([[], ['Vue warn', '[vue warn]', 'intlify', '[intlify']])
    })
  })

  BddTest().when('the original console warning throws', () => {
    const error = new Error('original warning failed')

    beforeEach(() => {
      originalWarn.mockImplementationOnce(() => {
        throw error
      })
      setupWarningHandler()
    })

    BddTest().then('it does not swallow the original console error', () => {
      expect(() => console.warn('ordinary warning')).toThrowError(error)
      expect(originalWarn).toHaveBeenCalledExactlyOnceWith('ordinary warning')
    })
  })
})
