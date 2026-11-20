import type { EditActivityAssessmentFormData } from '@/features/staff/activities/types/forms.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { formatDateLocalized } from '@avenirs-esr/shared'
import { addDays, format, parseISO, subDays } from 'date-fns'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { mockedSubActivitiesOverviewDTO, mockedSubActivitiesOverviewDTOWithPeriod } from '@/__mocks__/fixtures/shared/activities.fixtures'
import { mockedActivityContentWithDatedSubActivities, mockedActivityContentWithSubActivities } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { useEditNationalActivityFormValidators } from '@/features/staff/activities/composables/use-edit-national-activity-form-validators/use-edit-national-activity-form-validators'
import {
  ACTIVITY_ASSESSMENT_GRADE_MIN,
  ACTIVITY_CONSIGN_MAX_LENGTH,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN,
  ACTIVITY_RECOMMENDED_COMPLETION_CONTEXTS_MAX_LENGTH,
  ACTIVITY_SUMMARY_MAX_LENGTH,
  ACTIVITY_TITLE_MAX_LENGTH,
} from '@/features/staff/activities/config'

const DATE_INTERVAL_ERROR = 'La date de fin doit être postérieure à la date de début'
const MAX_LENGTH_ERROR = 'Veuillez limiter votre saisie à {maxLength} caractères'
const OPTION_REQUIRED_ERROR = 'Activez au moins une option\u00A0: commentaire, note ou validation'
const PARENT_ACTIVITY_OVERFLOWED_ERROR = 'La période doit être comprise dans celle de l\'activité parente, du {startDate} au {endDate}. Pour choisir une autre période, modifiez d\'abord les dates de l\'activité parente.'
const REQUIRED_ERROR = 'Ce champ est requis.'
const SUB_ACTIVITIES_NOT_COVERED_ERROR = 'La période doit couvrir celle des sous-activités, du {startDate} au {endDate}. Pour choisir une autre période, modifiez d\'abord les dates des sous-activités concernées.'

const NO_OPTIONS: EditActivityAssessmentFormData = { assessmentComment: false, assessmentValidation: false }

const PARENT_ACTIVITY = mockedActivityContentWithSubActivities
const PARENT_ACTIVITY_WITH_PERIOD = mockedActivityContentWithDatedSubActivities
const PARENT_ACTIVITY_START_DATE = PARENT_ACTIVITY_WITH_PERIOD.startDate!
const PARENT_ACTIVITY_END_DATE = PARENT_ACTIVITY_WITH_PERIOD.endDate!
const OVERFLOWING_START_DATE = format(subDays(parseISO(PARENT_ACTIVITY_START_DATE), 1), 'yyyy-MM-dd')
const OVERFLOWING_END_DATE = format(addDays(parseISO(PARENT_ACTIVITY_END_DATE), 1), 'yyyy-MM-dd')

const SUB_ACTIVITIES = mockedSubActivitiesOverviewDTO
const SUB_ACTIVITIES_WITH_PERIOD = mockedSubActivitiesOverviewDTOWithPeriod
const SUB_ACTIVITY_WITH_PERIOD = SUB_ACTIVITIES_WITH_PERIOD.find(({ startDate, endDate }) => startDate && endDate)!
const SUB_ACTIVITY_START_DATE = SUB_ACTIVITY_WITH_PERIOD.startDate!
const SUB_ACTIVITY_END_DATE = SUB_ACTIVITY_WITH_PERIOD.endDate!
const UNCOVERING_START_DATE = format(addDays(parseISO(SUB_ACTIVITY_START_DATE), 1), 'yyyy-MM-dd')
const UNCOVERING_END_DATE = format(subDays(parseISO(SUB_ACTIVITY_END_DATE), 1), 'yyyy-MM-dd')

BddTest().given('an edit national activity form validators composable', () => {
  let composableResult: ReturnType<typeof useEditNationalActivityFormValidators>

  const maxLengthError = (maxLength: number) => {
    return MAX_LENGTH_ERROR.replace('{maxLength}', String(maxLength))
  }

  const parentActivityOverflowedError = (startDate: string, endDate: string) => {
    return PARENT_ACTIVITY_OVERFLOWED_ERROR
      .replace('{startDate}', formatDateLocalized(startDate, 'fr', true))
      .replace('{endDate}', formatDateLocalized(endDate, 'fr', true))
  }

  const subActivitiesNotCoveredError = (startDate: string, endDate: string) => {
    return SUB_ACTIVITIES_NOT_COVERED_ERROR
      .replace('{startDate}', formatDateLocalized(startDate, 'fr', true))
      .replace('{endDate}', formatDateLocalized(endDate, 'fr', true))
  }

  beforeEach(() => {
    const result = mountComposable(() => useEditNationalActivityFormValidators(), {
      useI18n: true
    })
    composableResult = result.result
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should expose activity validators', () => {
      expect(composableResult.validateTitle).toBeDefined()
      expect(composableResult.validateThematic).toBeDefined()
      expect(composableResult.validateSummary).toBeDefined()
      expect(composableResult.validateDescription).toBeDefined()
      expect(composableResult.validateRecommendedCompletionContexts).toBeDefined()
      expect(composableResult.validateFeedbackAllowedIterations).toBeDefined()
      expect(composableResult.validateStartDate).toBeDefined()
      expect(composableResult.validateEndDate).toBeDefined()
      expect(composableResult.validatePeriodWithinParentActivity).toBeDefined()
      expect(composableResult.validatePeriodCoversSubActivities).toBeDefined()
      expect(composableResult.validateAssessmentGrade).toBeDefined()
      expect(composableResult.validateAssessmentOptions).toBeDefined()
    })
  })

  BddTest().when('validating title', () => {
    BddTest().then('it should require title', () => {
      expect(composableResult.validateTitle('')).toBe(REQUIRED_ERROR)
    })

    BddTest().then('it should enforce max length', () => {
      const longTitle = 'a'.repeat(ACTIVITY_TITLE_MAX_LENGTH + 1)
      expect(composableResult.validateTitle(longTitle)).toBe(maxLengthError(ACTIVITY_TITLE_MAX_LENGTH))
    })
  })

  BddTest().when('validating thematic', () => {
    BddTest().then('it should require thematic', () => {
      expect(composableResult.validateThematic(undefined)).toBe(REQUIRED_ERROR)
    })
  })

  BddTest().when('validating summary', () => {
    BddTest().then('it should require summary', () => {
      expect(composableResult.validateSummary('')).toBe(REQUIRED_ERROR)
    })

    BddTest().then('it should enforce max length', () => {
      const longSummary = 'a'.repeat(ACTIVITY_SUMMARY_MAX_LENGTH + 1)
      expect(composableResult.validateSummary(longSummary)).toBe(maxLengthError(ACTIVITY_SUMMARY_MAX_LENGTH))
    })
  })

  BddTest().when('validating description', () => {
    BddTest().then('it should enforce max length', () => {
      const longDescription = 'a'.repeat(ACTIVITY_CONSIGN_MAX_LENGTH + 1)
      expect(composableResult.validateDescription(longDescription)).toBe(maxLengthError(ACTIVITY_CONSIGN_MAX_LENGTH))
    })
  })

  BddTest().when('validating recommended completion contexts', () => {
    BddTest().then('it should enforce max length', () => {
      const longRecommendedCompletionContexts = 'a'.repeat(ACTIVITY_RECOMMENDED_COMPLETION_CONTEXTS_MAX_LENGTH + 1)
      expect(composableResult.validateRecommendedCompletionContexts(longRecommendedCompletionContexts)).toBe(maxLengthError(ACTIVITY_RECOMMENDED_COMPLETION_CONTEXTS_MAX_LENGTH))
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
      expect(composableResult.validateStartDate(undefined)).toBe(REQUIRED_ERROR)
    })
  })

  BddTest().when('validating end date', () => {
    BddTest().then('it should not require end date if start date is not set', () => {
      expect(composableResult.validateEndDate({ startDate: undefined, endDate: undefined })).toBeUndefined()
    })

    BddTest().then('it should require end date if start date is set', () => {
      expect(composableResult.validateEndDate({ startDate: '2025-02-01', endDate: undefined })).toBe(REQUIRED_ERROR)
    })

    BddTest().then('it should validate date interval if both dates are set', () => {
      expect(composableResult.validateEndDate({ startDate: '2025-02-01', endDate: '2025-01-01' })).toBe(DATE_INTERVAL_ERROR)
    })
  })

  BddTest().when('validating that the period is within the parent activity', () => {
    BddTest().then('it should accept a period within it, bounds included', () => {
      expect(composableResult.validatePeriodWithinParentActivity({ startDate: PARENT_ACTIVITY_START_DATE, endDate: PARENT_ACTIVITY_END_DATE }, PARENT_ACTIVITY_WITH_PERIOD)).toBeUndefined()
    })

    BddTest().then('it should reject a period starting before it, giving the period of the parent activity', () => {
      expect(composableResult.validatePeriodWithinParentActivity({ startDate: OVERFLOWING_START_DATE, endDate: PARENT_ACTIVITY_END_DATE }, PARENT_ACTIVITY_WITH_PERIOD)).toBe(parentActivityOverflowedError(PARENT_ACTIVITY_START_DATE, PARENT_ACTIVITY_END_DATE))
    })

    BddTest().then('it should reject a period ending after it, giving the period of the parent activity', () => {
      expect(composableResult.validatePeriodWithinParentActivity({ startDate: PARENT_ACTIVITY_START_DATE, endDate: OVERFLOWING_END_DATE }, PARENT_ACTIVITY_WITH_PERIOD)).toBe(parentActivityOverflowedError(PARENT_ACTIVITY_START_DATE, PARENT_ACTIVITY_END_DATE))
    })

    BddTest().then('it should not constrain an activity without a period', () => {
      expect(composableResult.validatePeriodWithinParentActivity({ startDate: undefined, endDate: undefined }, PARENT_ACTIVITY_WITH_PERIOD)).toBeUndefined()
    })

    BddTest().then('it should not constrain an incomplete period', () => {
      expect(composableResult.validatePeriodWithinParentActivity({ startDate: OVERFLOWING_START_DATE, endDate: undefined }, PARENT_ACTIVITY_WITH_PERIOD)).toBeUndefined()
    })

    BddTest().then('it should not constrain the period when the parent activity has none', () => {
      expect(composableResult.validatePeriodWithinParentActivity({ startDate: OVERFLOWING_START_DATE, endDate: OVERFLOWING_END_DATE }, PARENT_ACTIVITY)).toBeUndefined()
    })
  })

  BddTest().when('validating that the period covers the sub-activities', () => {
    BddTest().then('it should accept a period covering them, bounds included', () => {
      expect(composableResult.validatePeriodCoversSubActivities({ startDate: SUB_ACTIVITY_START_DATE, endDate: SUB_ACTIVITY_END_DATE }, SUB_ACTIVITIES_WITH_PERIOD)).toBeUndefined()
    })

    BddTest().then('it should reject a period starting after them, giving the period of the uncovered sub-activities', () => {
      expect(composableResult.validatePeriodCoversSubActivities({ startDate: UNCOVERING_START_DATE, endDate: SUB_ACTIVITY_END_DATE }, SUB_ACTIVITIES_WITH_PERIOD)).toBe(subActivitiesNotCoveredError(SUB_ACTIVITY_START_DATE, SUB_ACTIVITY_END_DATE))
    })

    BddTest().then('it should reject a period ending before them, giving the period of the uncovered sub-activities', () => {
      expect(composableResult.validatePeriodCoversSubActivities({ startDate: SUB_ACTIVITY_START_DATE, endDate: UNCOVERING_END_DATE }, SUB_ACTIVITIES_WITH_PERIOD)).toBe(subActivitiesNotCoveredError(SUB_ACTIVITY_START_DATE, SUB_ACTIVITY_END_DATE))
    })

    BddTest().then('it should not constrain an activity without a period', () => {
      expect(composableResult.validatePeriodCoversSubActivities({ startDate: undefined, endDate: undefined }, SUB_ACTIVITIES_WITH_PERIOD)).toBeUndefined()
    })

    BddTest().then('it should not constrain an incomplete period', () => {
      expect(composableResult.validatePeriodCoversSubActivities({ startDate: UNCOVERING_START_DATE, endDate: undefined }, SUB_ACTIVITIES_WITH_PERIOD)).toBeUndefined()
    })

    BddTest().then('it should not constrain the period when no sub-activity has one', () => {
      expect(composableResult.validatePeriodCoversSubActivities({ startDate: UNCOVERING_START_DATE, endDate: SUB_ACTIVITY_END_DATE }, SUB_ACTIVITIES)).toBeUndefined()
    })
  })

  BddTest().when('validating assessment grade', () => {
    BddTest().then('it should accept a missing grade when it is not required', () => {
      expect(composableResult.validateAssessmentGrade(undefined)).toBeUndefined()
    })

    BddTest().then('it should require the grade when the grade option is selected', () => {
      expect(composableResult.validateAssessmentGrade(undefined, true)).toBe(REQUIRED_ERROR)
    })

    BddTest().then('it should accept the smallest positive grade', () => {
      expect(composableResult.validateAssessmentGrade(ACTIVITY_ASSESSMENT_GRADE_MIN)).toBeUndefined()
    })

    BddTest().then('it should accept a decimal grade', () => {
      expect(composableResult.validateAssessmentGrade(12.5)).toBeUndefined()
    })

    BddTest().then('it should reject a zero grade', () => {
      expect(composableResult.validateAssessmentGrade(0)).toBeTruthy()
    })

    BddTest().then('it should reject a negative grade', () => {
      expect(composableResult.validateAssessmentGrade(-1)).toBeTruthy()
    })
  })

  BddTest().when('validating assessment options', () => {
    BddTest().then('it should require at least one option', () => {
      expect(composableResult.validateAssessmentOptions(NO_OPTIONS)).toBe(OPTION_REQUIRED_ERROR)
    })

    BddTest().then('it should accept a comment alone', () => {
      expect(composableResult.validateAssessmentOptions({ ...NO_OPTIONS, assessmentComment: true })).toBeUndefined()
    })

    BddTest().then('it should accept a grade alone', () => {
      expect(composableResult.validateAssessmentOptions({ ...NO_OPTIONS, assessmentGrade: 20 })).toBeUndefined()
    })

    BddTest().then('it should accept a validation alone', () => {
      expect(composableResult.validateAssessmentOptions({ ...NO_OPTIONS, assessmentValidation: true })).toBeUndefined()
    })

    BddTest().then('it should count the enabled grade option as an option, even without grade', () => {
      expect(composableResult.validateAssessmentOptions(NO_OPTIONS, true)).toBeUndefined()
    })

    BddTest().then('it should count an invalid grade as a selected option, its value being checked by validateAssessmentGrade', () => {
      expect(composableResult.validateAssessmentOptions({ ...NO_OPTIONS, assessmentGrade: 0 })).toBeUndefined()
    })
  })
})
