import { FEEDBACK_MAX_LENGTH } from '@/features/staff/feedbacks/config'
import { useWriteFeedbackFormValidators } from '@/features/staff/feedbacks/views/ActivityFeedbacksView/composables/use-write-feedback-form-validators/use-write-feedback-form-validators'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a write feedback form validators composable', () => {
  let composableResult: ReturnType<typeof useWriteFeedbackFormValidators>

  beforeEach(() => {
    const result = mountComposable(() => useWriteFeedbackFormValidators(), {
      useI18n: true
    })
    composableResult = result.result
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should expose feedback validators', () => {
      expect(composableResult.validateFeedback).toBeDefined()
    })
  })

  BddTest().when('validating feedback', () => {
    BddTest().then('it should require feedback when empty', () => {
      expect(composableResult.validateFeedback('')).toBe('Ce champ est requis.')
    })

    BddTest().then('it should require feedback when undefined', () => {
      expect(composableResult.validateFeedback(undefined as unknown as string)).toBe('Ce champ est requis.')
    })

    BddTest().then('it should require feedback when null', () => {
      expect(composableResult.validateFeedback(null as unknown as string)).toBe('Ce champ est requis.')
    })

    BddTest().then('it should enforce max length', () => {
      const tooLongFeedback = 'a'.repeat(FEEDBACK_MAX_LENGTH + 1)
      expect(composableResult.validateFeedback(tooLongFeedback)).toBe(`Veuillez limiter votre saisie à ${FEEDBACK_MAX_LENGTH} caractères`)
    })

    BddTest().then('it should accept feedback at max length', () => {
      const feedbackAtMaxLength = 'a'.repeat(FEEDBACK_MAX_LENGTH)
      expect(composableResult.validateFeedback(feedbackAtMaxLength)).toBeUndefined()
    })

    BddTest().then('it should accept valid feedback', () => {
      expect(composableResult.validateFeedback('Feedback valide')).toBeUndefined()
    })
  })
})
