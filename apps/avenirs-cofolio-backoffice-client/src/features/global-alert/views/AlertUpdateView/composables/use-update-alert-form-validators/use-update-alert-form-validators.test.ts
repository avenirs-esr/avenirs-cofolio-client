import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'
import { useUpdateAlertFormValidators } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form-validators/use-update-alert-form-validators'
import { mountComposable } from '@/tests/utils'

const END_DATE_BEFORE_START_DATE_ERROR = 'La date de fin doit être postérieure à la date de début'
const END_DATE_REQUIRED_ERROR = 'Veuillez renseigner une date de fin.'
const REQUIRED_ERROR = 'Ce champ est requis.'

const MESSAGE_CASES = [
  {
    description: 'empty',
    message: '',
    error: REQUIRED_ERROR,
  },
  {
    description: 'blank',
    message: '   ',
    error: REQUIRED_ERROR,
  },
  {
    description: 'filled',
    message: 'Maintenance prévue ce soir',
  },
]

const PERIOD_CASES = [
  {
    description: 'no dates',
  },
  {
    description: 'a start date only',
    startDate: '2026-11-05',
    errors: {
      endDate: END_DATE_REQUIRED_ERROR
    },
  },
  {
    description: 'an end date only',
    endDate: '2026-11-05',
    errors: {
      startDate: REQUIRED_ERROR
    },
  },
  {
    description: 'an end date before the start date',
    startDate: '2026-11-05',
    endDate: '2026-11-04',
    errors: {
      endDate: END_DATE_BEFORE_START_DATE_ERROR
    },
  },
  {
    description: 'the same start and end date',
    startDate: '2026-11-05',
    endDate: '2026-11-05',
  },
  {
    description: 'an end date after the start date',
    startDate: '2026-11-05',
    endDate: '2026-11-08',
  },
]

BddTest().given('an alert update form validators composable', () => {
  let validators: ReturnType<typeof useUpdateAlertFormValidators>

  beforeEach(() => {
    validators = mountComposable(() => useUpdateAlertFormValidators(), {
      useI18n: true
    }).result
  })

  BddTest().when('validating the message', () => {
    MESSAGE_CASES.forEach(({ description, message, error }) => {
      BddTest().and(`the message is ${description}`, () => {
        BddTest().then('it should return the expected error', () => {
          expect(validators.validateMessage(message)).toBe(error)
        })
      })
    })
  })

  BddTest().when('validating the period', () => {
    PERIOD_CASES.forEach(({ description, startDate, endDate, errors = {} }) => {
      BddTest().and(`the period has ${description}`, () => {
        BddTest().then('it should return the expected errors', () => {
          expect({
            startDate: validators.validateStartDate(startDate, endDate),
            endDate: validators.validateEndDate(endDate, startDate),
          }).toEqual(errors)
        })
      })
    })
  })
})
