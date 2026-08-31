import type { TraceFormData } from '@/features/traces/types/traces.types'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTraceFileValidation } from '@/features/traces/composables/use-trace-file/use-trace-file'
import { TRACE_IA_JUSTIFICATION_MAX_LENGTH, TRACE_LINK_MAX_LENGTH, TRACE_NAME_MAX_LENGTH, TRACE_PERSONAL_NOTE_MAX_LENGTH } from '@/features/traces/config'
import { isTraceFileType, isTraceLinkType } from '@/features/traces/utils/trace.types-guard'

/**
 * Composable providing validation logic for student trace forms, including both creation and update forms.
 * It centralizes the validation rules for trace form fields, ensuring consistency across different trace-related components.
 * @returns An object containing the `buildValidators` function, which generates validation results based on the current form values.
 */
export function useTraceFormValidators () {
  const { validateLink, validateRequired, validateMaxLength } = useFormValidators()
  const { validateFile } = useTraceFileValidation(true)

  function buildValidators (value: TraceFormData) {
    return {
      fields: {
        file: isTraceFileType(value) ? validateFile(value.file) : undefined,
        link: isTraceLinkType(value) ? validateLink(value.link, true) ?? validateMaxLength(value.link, TRACE_LINK_MAX_LENGTH) : undefined,
        traceName: validateRequired(value.traceName) ?? validateMaxLength(value.traceName, TRACE_NAME_MAX_LENGTH),
        authorType: validateRequired(value.authorType),
        iaJustification: value.useIA && (validateRequired(value.iaJustification) ?? validateMaxLength(value.iaJustification, TRACE_IA_JUSTIFICATION_MAX_LENGTH)),
        personalNote: validateMaxLength(value.personalNote, TRACE_PERSONAL_NOTE_MAX_LENGTH)
      }
    }
  }

  return {
    buildValidators
  }
}
