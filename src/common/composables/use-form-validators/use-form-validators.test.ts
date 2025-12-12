import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a form validators composable', () => {
  let composableResult: ReturnType<typeof useFormValidators>

  beforeEach(() => {
    const result = mountComposable(() => useFormValidators(), {
      useI18n: true
    })
    composableResult = result.result
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should return validation functions', () => {
      expect(composableResult.validateRequired).toBeDefined()
      expect(composableResult.validateMaxLength).toBeDefined()
    })
  })

  BddTest().when('validating required field', () => {
    BddTest().and('the value is empty string', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateRequired('')
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the value is undefined', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateRequired(undefined)
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the value is null', () => {
      BddTest().then('it should return required error', () => {
        const error = composableResult.validateRequired(null)
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the value is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateRequired('Valid value')
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating max length', () => {
    BddTest().and('the value is empty string', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateMaxLength('', 10)
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the value is undefined', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateMaxLength(undefined, 10)
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the value is null', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateMaxLength(null, 10)
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the value exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const error = composableResult.validateMaxLength('This is a very long string', 10)
        expect(error).toBe('Veuillez limiter votre saisie à 10 caractères')
      })
    })

    BddTest().and('the value is at max length', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateMaxLength('1234567890', 10)
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the value is under max length', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateMaxLength('Short', 10)
        expect(error).toBeUndefined()
      })
    })
  })
})
