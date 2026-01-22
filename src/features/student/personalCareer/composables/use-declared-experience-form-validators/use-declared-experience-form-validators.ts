import type { DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import { useFormValidators, type ValidationOptions } from '@/common/composables/use-form-validators/use-form-validators'
import {
  DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH,
  DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH,
  DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_REVIEW_MAX_LENGTH,
  DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_TITLE_MAX_LENGTH
} from '@/features/student/personalCareer/config'

export function useDeclaredExperienceFormValidators () {
  const { validateRequired, validateMaxLength, validateDateInterval } = useFormValidators()

  function validateTitle (title: DeclaredExperienceFormData['title']) {
    return validateRequired(title) ?? validateMaxLength(title, DECLARED_EXPERIENCE_TITLE_MAX_LENGTH)
  }

  function validateType (type: DeclaredExperienceFormData['type']) {
    return validateRequired(type)
  }

  function validateOrganization (organization: DeclaredExperienceFormData['organization']) {
    return validateRequired(organization) ?? validateMaxLength(organization, DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH)
  }

  function validateActivitySector (activitySector: DeclaredExperienceFormData['activitySector']) {
    return validateMaxLength(activitySector, DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH)
  }

  function validateLocation (location: DeclaredExperienceFormData['location']) {
    return validateMaxLength(location, DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH)
  }

  function validateSourceOfInformation (sourceOfInformation: DeclaredExperienceFormData['sourceOfInformation']) {
    return validateMaxLength(sourceOfInformation, DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH)
  }

  function validateDescription (description: DeclaredExperienceFormData['description']) {
    return validateMaxLength(description, DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH)
  }

  function validateReview (review: DeclaredExperienceFormData['review']) {
    return validateMaxLength(review, DECLARED_EXPERIENCE_REVIEW_MAX_LENGTH)
  }

  function validateStartDate (startDate: DeclaredExperienceFormData['startDate']) {
    return validateRequired(startDate)
  }

  function validateEndDate (
    endDate: DeclaredExperienceFormData['endDate'],
    startDate: DeclaredExperienceFormData['startDate'],
    options: ValidationOptions = { isRequired: false }
  ) {
    return validateDateInterval({
      startDate,
      endDate,
      format: 'yyyy-MM',
      isOnGoing: !options.isRequired
    })
  }

  return {
    validateActivitySector,
    validateDescription,
    validateEndDate,
    validateLocation,
    validateOrganization,
    validateReview,
    validateSourceOfInformation,
    validateStartDate,
    validateTitle,
    validateType
  }
}
