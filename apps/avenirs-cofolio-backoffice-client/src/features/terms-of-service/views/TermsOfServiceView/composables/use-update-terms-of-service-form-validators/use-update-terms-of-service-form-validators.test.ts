import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'
import { useUpdateTermsOfServiceFormValidators } from '@/features/terms-of-service/views/TermsOfServiceView/composables/use-update-terms-of-service-form-validators/use-update-terms-of-service-form-validators'
import { mountComposable } from '@/tests/utils'

const REQUIRED_ERROR = 'Ce champ est requis.'

const DESCRIPTION_CASES = [
  {
    description: 'undefined',
    value: undefined,
    error: REQUIRED_ERROR,
  },
  {
    description: 'empty',
    value: '',
    error: REQUIRED_ERROR,
  },
  {
    description: 'blank',
    value: '   ',
    error: REQUIRED_ERROR,
  },
  {
    description: 'filled',
    value: '<p>Conditions Générales d\'Utilisation</p>',
  },
]

BddTest().given('a terms of service update form validators composable', () => {
  let validators: ReturnType<typeof useUpdateTermsOfServiceFormValidators>

  beforeEach(() => {
    validators = mountComposable(() => useUpdateTermsOfServiceFormValidators(), {
      useI18n: true,
    }).result
  })

  BddTest().when('validating the description', () => {
    DESCRIPTION_CASES.forEach(({ description, value, error }) => {
      BddTest().and(`the description is ${description}`, () => {
        BddTest().then('it should return the expected error', () => {
          expect(validators.validateDescription(value)).toBe(error)
        })
      })
    })
  })
})
