import type { EditActivityAssessmentFormData } from '@/features/staff/activities/types/forms.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'
import { toActivityAssessmentRequest } from '@/features/staff/activities/utils/activity-assessment'

const NO_OPTIONS: EditActivityAssessmentFormData = {
  assessmentComment: false,
  assessmentGrade: undefined,
  assessmentValidation: false
}

BddTest().given('an activity assessment util', () => {
  BddTest().when('converting the assessment form values to a request', () => {
    BddTest().then('it should return an empty assessment when no option is selected, so that the assessment is deleted', () => {
      expect(toActivityAssessmentRequest(NO_OPTIONS)).toEqual({})
    })

    BddTest().then('it should keep the comment alone', () => {
      expect(toActivityAssessmentRequest({ ...NO_OPTIONS, assessmentComment: true })).toEqual({ comment: true })
    })

    BddTest().then('it should keep the validation alone', () => {
      expect(toActivityAssessmentRequest({ ...NO_OPTIONS, assessmentValidation: true })).toEqual({ validation: true })
    })

    BddTest().then('it should keep the grade alone', () => {
      expect(toActivityAssessmentRequest({ ...NO_OPTIONS, assessmentGrade: 20 })).toEqual({ grade: 20 })
    })

    BddTest().then('it should keep a zero grade, only a missing grade being omitted', () => {
      expect(toActivityAssessmentRequest({ ...NO_OPTIONS, assessmentGrade: 0 })).toEqual({ grade: 0 })
    })

    BddTest().then('it should combine the selected options', () => {
      expect(toActivityAssessmentRequest({ ...NO_OPTIONS, assessmentComment: true, assessmentGrade: 20 })).toEqual({ comment: true, grade: 20 })
    })
  })
})
