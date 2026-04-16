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
      expect(composableResult.validateDateInterval).toBeDefined()
      expect(composableResult.validateLink).toBeDefined()
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

  BddTest().when('validating ongoing interval', () => {
    BddTest().and('startDate is missing', () => {
      BddTest().then('it should return required error for startDate', () => {
        const error = composableResult.validateDateInterval({
          startDate: undefined,
          endDate: '2025-06',
          format: 'yyyy-MM'
        })
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('endDate is missing and not required', () => {
      BddTest().then('it should return undefined (ongoing interval is valid)', () => {
        const error = composableResult.validateDateInterval({
          startDate: '2025-01',
          endDate: null,
          format: 'yyyy-MM',
          isOnGoing: true
        })
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('endDate is missing and required', () => {
      BddTest().then('it should return required error for endDate', () => {
        const error = composableResult.validateDateInterval({
          startDate: '2025-01',
          endDate: null,
          format: 'yyyy-MM',
          isOnGoing: false
        })
        expect(error).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('endDate is before startDate', () => {
      BddTest().then('it should return chronological error', () => {
        const error = composableResult.validateDateInterval({
          startDate: '2025-06',
          endDate: '2025-05',
          format: 'yyyy-MM'
        })
        expect(error).toBe('La date de fin doit être postérieure à la date de début')
      })
    })

    BddTest().and('endDate is after startDate', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateDateInterval({
          startDate: '2025-05',
          endDate: '2025-06',
          format: 'yyyy-MM'
        })
        expect(error).toBeUndefined()
      })
    })
  })

  BddTest().when('validating link format', () => {
    BddTest().and('the link is valid', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateLink('https://example.com', true)
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the link is invalid', () => {
      BddTest().then('it should return invalid link error', () => {
        const error = composableResult.validateLink('invalid-link', true)
        expect(error).toBe('Veuillez renseigner une URL valide (ex. : http://www.exemple.com)')
      })
    })

    BddTest().and('the link is empty', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateLink('')
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the link is undefined', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateLink(undefined)
        expect(error).toBeUndefined()
      })
    })

    BddTest().and('the link is null', () => {
      BddTest().then('it should return undefined', () => {
        const error = composableResult.validateLink(null)
        expect(error).toBeUndefined()
      })
    })
  })
})
