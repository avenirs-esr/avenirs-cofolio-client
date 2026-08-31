import type { DeclaredProgramFormData } from '@/features/personalCareer/types/forms.types'
import { useFormValidators, type ValidationOptions } from '@/common/composables/use-form-validators/use-form-validators'
import {
  DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH,
  DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH,
  DECLARED_PROGRAM_RESULT_MAX_LENGTH,
  DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH,
  DECLARED_PROGRAM_TITLE_MAX_LENGTH
} from '@/features/personalCareer/config'

/**
 * Composable providing validation functions for declared program form fields.
 * It will be used in both add and edit declared program forms.
 * @returns An object containing validation functions for each form field.
 */
export function useDeclaredProgramFormValidators () {
  const { validateRequired, validateMaxLength, validateDateInterval } = useFormValidators()

  function validateTitle (title: DeclaredProgramFormData['title']) {
    return validateRequired(title) ?? validateMaxLength(title, DECLARED_PROGRAM_TITLE_MAX_LENGTH)
  }

  function validateDescription (description: DeclaredProgramFormData['description']) {
    return validateMaxLength(description, DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH)
  }

  function validateOrganization (organization: DeclaredProgramFormData['organization']) {
    return validateRequired(organization) ?? validateMaxLength(organization, DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH)
  }

  function validateResult (result: DeclaredProgramFormData['result']) {
    return validateMaxLength(result, DECLARED_PROGRAM_RESULT_MAX_LENGTH)
  }

  function validateSourceOfInformation (sourceOfInformation: DeclaredProgramFormData['sourceOfInformation']) {
    return validateMaxLength(sourceOfInformation, DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH)
  }

  function validateStartDate (startDate: DeclaredProgramFormData['startDate']) {
    return validateRequired(startDate)
  }

  function validateEndDate (endDate: DeclaredProgramFormData['endDate'], startDate: DeclaredProgramFormData['startDate'], options: ValidationOptions = { isRequired: false }) {
    return validateDateInterval({
      startDate,
      endDate,
      format: 'yyyy-MM',
      isOnGoing: !options.isRequired
    })
  }

  return {
    validateDescription,
    validateEndDate,
    validateOrganization,
    validateResult,
    validateSourceOfInformation,
    validateStartDate,
    validateTitle
  }
}
