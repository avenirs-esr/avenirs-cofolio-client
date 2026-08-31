import type { DeclaredExperienceFormData } from '@/features/personalCareer/types/forms.types'
import { useFormValidators, type ValidationOptions } from '@/common/composables/use-form-validators/use-form-validators'
import {
  DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH,
  DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH,
  DECLARED_EXPERIENCE_EXTERNAL_LINK_MAX_LENGTH,
  DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH,
  DECLARED_EXPERIENCE_TITLE_MAX_LENGTH
} from '@/features/personalCareer/config'

export function useDeclaredExperienceFormValidators () {
  const { validateRequired, validateMaxLength, validateDateInterval, validateLink } = useFormValidators()

  function validateTitleMaxLength (title: DeclaredExperienceFormData['title']) {
    return validateMaxLength(title, DECLARED_EXPERIENCE_TITLE_MAX_LENGTH)
  }

  function validateTitle (title: DeclaredExperienceFormData['title']) {
    return validateRequired(title) ?? validateTitleMaxLength(title)
  }

  function validateOrganizationMaxLength (organization: DeclaredExperienceFormData['organization']) {
    return validateMaxLength(organization, DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH)
  }

  function validateOrganization (organization: DeclaredExperienceFormData['organization']) {
    return validateRequired(organization) ?? validateOrganizationMaxLength(organization)
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

  function validateSummary (summary: DeclaredExperienceFormData['summary']) {
    return validateMaxLength(summary, DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH)
  }

  function validateExternalLinkMaxLength (externalLink: DeclaredExperienceFormData['externalLink']) {
    return validateMaxLength(externalLink, DECLARED_EXPERIENCE_EXTERNAL_LINK_MAX_LENGTH)
  }

  function validateExternalLink (externalLink: DeclaredExperienceFormData['externalLink']) {
    return validateExternalLinkMaxLength(externalLink) ?? validateLink(externalLink)
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
    validateExternalLinkMaxLength,
    validateExternalLink,
    validateLocation,
    validateOrganizationMaxLength,
    validateOrganization,
    validateSummary,
    validateSourceOfInformation,
    validateStartDate,
    validateTitleMaxLength,
    validateTitle,
  }
}
