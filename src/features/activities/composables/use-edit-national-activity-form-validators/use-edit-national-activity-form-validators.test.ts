import { useEditNationalActivityFormValidators } from '@/features/activities/composables/use-edit-national-activity-form-validators/use-edit-national-activity-form-validators'
import {
  ACTIVITY_CONSIGN_MAX_LENGTH,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN,
  ACTIVITY_RECOMMENDED_COMPLETION_CONTEXTS_MAX_LENGTH,
  ACTIVITY_SUMMARY_MAX_LENGTH,
  ACTIVITY_TITLE_MAX_LENGTH,
} from '@/features/activities/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an edit national activity form validators composable', () => {
  let composableResult: ReturnType<typeof useEditNationalActivityFormValidators>

  beforeEach(() => {
    const result = mountComposable(() => useEditNationalActivityFormValidators(), {
      useI18n: true
    })
    composableResult = result.result
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should expose activity validators', () => {
      expect(composableResult.validateTitle).toBeDefined()
      expect(composableResult.validateSummary).toBeDefined()
      expect(composableResult.validateDescription).toBeDefined()
      expect(composableResult.validateRecommendedCompletionContexts).toBeDefined()
      expect(composableResult.validateFeedbackAllowedIterations).toBeDefined()
      expect(composableResult.validateStartDate).toBeDefined()
      expect(composableResult.validateEndDate).toBeDefined()
    })
  })

  BddTest().when('validating title', () => {
    BddTest().then('it should require title', () => {
      expect(composableResult.validateTitle('')).toBe('Ce champ est requis.')
    })

    BddTest().then('it should enforce max length', () => {
      const longTitle = 'a'.repeat(ACTIVITY_TITLE_MAX_LENGTH + 1)
      expect(composableResult.validateTitle(longTitle)).toBe(`Veuillez limiter votre saisie à ${ACTIVITY_TITLE_MAX_LENGTH} caractères`)
    })
  })

  BddTest().when('validating summary', () => {
    BddTest().then('it should require summary', () => {
      expect(composableResult.validateSummary('')).toBe('Ce champ est requis.')
    })

    BddTest().then('it should enforce max length', () => {
      const longSummary = 'a'.repeat(ACTIVITY_SUMMARY_MAX_LENGTH + 1)
      expect(composableResult.validateSummary(longSummary)).toBe(`Veuillez limiter votre saisie à ${ACTIVITY_SUMMARY_MAX_LENGTH} caractères`)
    })
  })

  BddTest().when('validating description', () => {
    BddTest().then('it should enforce max length', () => {
      const longDescription = 'a'.repeat(ACTIVITY_CONSIGN_MAX_LENGTH + 1)
      expect(composableResult.validateDescription(longDescription)).toBe(`Veuillez limiter votre saisie à ${ACTIVITY_CONSIGN_MAX_LENGTH} caractères`)
    })
  })

  BddTest().when('validating recommended completion contexts', () => {
    BddTest().then('it should enforce max length', () => {
      const longRecommendedCompletionContexts = 'a'.repeat(ACTIVITY_RECOMMENDED_COMPLETION_CONTEXTS_MAX_LENGTH + 1)
      expect(composableResult.validateRecommendedCompletionContexts(longRecommendedCompletionContexts)).toBe(`Veuillez limiter votre saisie à ${ACTIVITY_RECOMMENDED_COMPLETION_CONTEXTS_MAX_LENGTH} caractères`)
    })
  })

  BddTest().when('validating feedback iterations', () => {
    BddTest().then('it should allow disabled sentinel value', () => {
      expect(composableResult.validateFeedbackAllowedIterations(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED)).toBeUndefined()
    })

    BddTest().then('it should allow infinity sentinel value', () => {
      expect(composableResult.validateFeedbackAllowedIterations(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY)).toBeUndefined()
    })

    BddTest().then('it should accept positive values greater than or equal to min', () => {
      expect(composableResult.validateFeedbackAllowedIterations(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN)).toBeUndefined()
    })
  })

  BddTest().when('validating start date', () => {
    BddTest().then('it should require start date', () => {
      expect(composableResult.validateStartDate(undefined)).toBe('Ce champ est requis.')
    })
  })

  BddTest().when('validating end date', () => {
    BddTest().then('it should not require end date if start date is not set', () => {
      expect(composableResult.validateEndDate({ startDate: undefined, endDate: undefined })).toBeUndefined()
    })

    BddTest().then('it should require end date if start date is set', () => {
      expect(composableResult.validateEndDate({ startDate: '2025-02-01', endDate: undefined })).toBe('Ce champ est requis.')
    })

    BddTest().then('it should validate date interval if both dates are set', () => {
      expect(composableResult.validateEndDate({ startDate: '2025-02-01', endDate: '2025-01-01' })).toBe('La date de fin doit être postérieure à la date de début')
    })
  })
})
