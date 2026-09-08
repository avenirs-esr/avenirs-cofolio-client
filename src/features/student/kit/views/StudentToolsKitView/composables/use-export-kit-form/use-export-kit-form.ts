import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { KIT_NAME_MAX_LENGTH } from '@/features/student/kit/config'
import { useForm } from '@tanstack/vue-form'

export enum ExportKitOptions {
  TEXT_CONTENT = 'textContent',
  MEDIA_CONTENT = 'mediaContent'
}

export interface UseExportKitFormData {
  exportOptions: ExportKitOptions[]
  kitName: string
}

export function useExportKitForm (onSuccess: ({ exportOptions, kitName }: UseExportKitFormData) => void) {
  const { validateMaxLength, validateRequired, hasFieldErrors } = useFormValidators()

  const defaultValues: UseExportKitFormData = {
    exportOptions: [],
    kitName: ''
  }

  const validateExportOptions = (value?: ExportKitOptions[]) =>
    validateRequired(value)

  const validateKitName = (value?: string) =>
    validateRequired(value) ?? validateMaxLength(value, KIT_NAME_MAX_LENGTH)

  const form = useForm({
    defaultValues,
    validators: {
      onChange ({ value }: { value: UseExportKitFormData }) {
        return {
          fields: {
            exportOptions: validateExportOptions(value.exportOptions),
            kitName: validateKitName(value.kitName)
          }
        }
      },
      onSubmit ({ value }: { value: UseExportKitFormData }) {
        return {
          fields: {
            exportOptions: validateExportOptions(value.exportOptions),
            kitName: validateKitName(value.kitName)
          }
        }
      }
    },
    onSubmit: ({ value }) => {
      onSuccess(value)
    },
  })

  const hasNameErrors = hasFieldErrors(form, ['kitName'])

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isDirty
      && state.value.isValid
      && !state.value.isValidating
      && !hasNameErrors.value
      && state.value.values.exportOptions.length > 0
  })

  function resetForm () {
    form.reset(defaultValues)
  }

  return {
    form,
    isFormValid,
    resetForm,
  }
}
