import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { ASSESSMENT_COMMENT_MAX_LENGTH } from '@/features/staff/assessments/config'
import { useWriteAssessmentFormValidators } from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/composables/use-write-assessment-form-validators/use-write-assessment-form-validators'

const MAX_GRADE = 20
const REQUIRED_ERROR = 'Ce champ est requis.'
const INTEGER_GRADE_ERROR = 'Veuillez renseigner une note entière'
const MIN_ERROR = 'Veuillez renseigner une valeur supérieure ou égale à 0'
const MAX_ERROR = `Veuillez renseigner une valeur inférieure ou égale à ${MAX_GRADE}`
const MAX_LENGTH_ERROR = `Veuillez limiter votre saisie à ${ASSESSMENT_COMMENT_MAX_LENGTH} caractères`

BddTest().given('the write assessment form validators', () => {
  let validators: ReturnType<typeof useWriteAssessmentFormValidators>

  beforeEach(() => {
    validators = mountComposable(() => useWriteAssessmentFormValidators(), { useI18n: true }).result
  })

  BddTest().when('a grade is validated', () => {
    BddTest().then('it should require a grade', () => {
      expect(validators.validateGrade(null, MAX_GRADE)).toBe(REQUIRED_ERROR)
    })

    BddTest().then('it should refuse a decimal grade', () => {
      expect(validators.validateGrade(12.5, MAX_GRADE)).toBe(INTEGER_GRADE_ERROR)
    })

    BddTest().then('it should refuse a negative grade', () => {
      expect(validators.validateGrade(-1, MAX_GRADE)).toBe(MIN_ERROR)
    })

    BddTest().then('it should refuse a grade above the grading scale', () => {
      expect(validators.validateGrade(MAX_GRADE + 1, MAX_GRADE)).toBe(MAX_ERROR)
    })

    BddTest().then('it should accept the bounds of the grading scale', () => {
      expect(validators.validateGrade(0, MAX_GRADE)).toBeUndefined()
      expect(validators.validateGrade(MAX_GRADE, MAX_GRADE)).toBeUndefined()
    })
  })

  BddTest().when('a validation is validated', () => {
    BddTest().then('it should require a choice', () => {
      expect(validators.validateValidation(null)).toBe(REQUIRED_ERROR)
    })

    BddTest().then('it should accept both choices', () => {
      expect(validators.validateValidation(true)).toBeUndefined()
      expect(validators.validateValidation(false)).toBeUndefined()
    })
  })

  BddTest().when('a required comment is validated', () => {
    BddTest().then('it should require a comment that is not blank', () => {
      expect(validators.validateComment('', true)).toBe(REQUIRED_ERROR)
      expect(validators.validateComment('   ', true)).toBe(REQUIRED_ERROR)
    })

    BddTest().then('it should refuse a comment exceeding the max length', () => {
      expect(validators.validateComment('a'.repeat(ASSESSMENT_COMMENT_MAX_LENGTH + 1), true)).toBe(MAX_LENGTH_ERROR)
    })

    BddTest().then('it should accept a comment within the max length', () => {
      expect(validators.validateComment('a'.repeat(ASSESSMENT_COMMENT_MAX_LENGTH), true)).toBeUndefined()
    })
  })

  BddTest().when('an optional comment is validated', () => {
    BddTest().then('it should accept an empty comment', () => {
      expect(validators.validateComment('', false)).toBeUndefined()
    })

    BddTest().then('it should still refuse a comment exceeding the max length', () => {
      expect(validators.validateComment('a'.repeat(ASSESSMENT_COMMENT_MAX_LENGTH + 1), false)).toBe(MAX_LENGTH_ERROR)
    })
  })
})
