import type { ToolFormData } from '#shared/composables/use-add-tool-form/use-add-tool-form'
import { useFormValidators } from '#shared/composables/use-form-validators/use-form-validators'
import { TOOL_DESCRIPTION_MAX_LENGTH, TOOL_NAME_MAX_LENGTH } from '#shared/utils/tool.config'

export function useToolFormValidators () {
  const { validateRequired, validateMaxLength, validateLink } = useFormValidators()

  function validateName (name: ToolFormData['name']) {
    return validateRequired(name?.trim()) ?? validateMaxLength(name, TOOL_NAME_MAX_LENGTH)
  }

  function validateDescription (description: ToolFormData['description']) {
    return validateRequired(description?.trim()) ?? validateMaxLength(description, TOOL_DESCRIPTION_MAX_LENGTH)
  }

  function validateUrl (url: ToolFormData['url']) {
    return validateLink(url?.trim(), true)
  }

  return {
    validateName,
    validateDescription,
    validateUrl,
  }
}
