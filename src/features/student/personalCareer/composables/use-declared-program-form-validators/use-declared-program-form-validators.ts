import type { DeclaredProgramFormData } from '@/features/student/personalCareer/types/forms.types'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import {
  DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH,
  DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH,
  DECLARED_PROGRAM_RESULT_MAX_LENGTH,
  DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH,
  DECLARED_PROGRAM_TITLE_MAX_LENGTH
} from '@/features/student/personalCareer/config'
import { isBefore, parse } from 'date-fns'
import { useI18n } from 'vue-i18n'

interface ValidationOptions {
  isRequired?: boolean
  maxLength?: number
}

const defaultValidationOptions: ValidationOptions = {
  isRequired: false
}

/**
 * Composable providing validation functions for declared program form fields.
 * It will be used in both add and edit declared program forms.
 * @returns An object containing validation functions for each form field.
 */
export function useDeclaredProgramFormValidators () {
  const { t } = useI18n()
  const { validateRequired, validateMaxLength } = useFormValidators()

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

  function validateEndDate (endDate: DeclaredProgramFormData['endDate'], startDate: DeclaredProgramFormData['startDate'], options: ValidationOptions = defaultValidationOptions) {
    if (options.isRequired) {
      const requiredError = validateRequired(endDate)
      if (requiredError) {
        return requiredError
      }
    }

    if (endDate && startDate) {
      const parsedEndDate = parse(endDate, 'yyyy-MM', new Date())
      const parsedStartDate = parse(startDate, 'yyyy-MM', new Date())

      if (isBefore(parsedEndDate, parsedStartDate)) {
        return t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.errors.endDateBeforeStartDate')
      }
    }
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
