import type { BaseApiException } from '@/common/exceptions'
import type { DeclaredProgramFormData } from '@/features/student/personalCareer/types/forms.types'
import { type DeclaredProgramRequestDTO, invalidateGetDeclaredPrograms, useCreateDeclaredProgram } from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { formatYearMonthToDate } from '@/common/utils'
import { useDeclaredProgramFormValidators } from '@/features/student/personalCareer/composables/use-declared-program-form-validators/use-declared-program-form-validators'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export function useAddDeclaredProgramForm (onProgramAdded?: () => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()
  const onCreateDeclaredProgramError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.personalCareer.overlays.AddDeclaredProgramDrawer.errors.createDeclaredProgram'),
      description: error.message
    })
  }

  const validators = useDeclaredProgramFormValidators()

  const { mutate: mutateCreateDeclaredProgram, isPending } = useCreateDeclaredProgram()

  function createDeclaredProgram (value: DeclaredProgramRequestDTO) {
    mutateCreateDeclaredProgram({ data: value }, {
      onSuccess: async () => {
        await withTaskLoading(() => invalidateGetDeclaredPrograms(queryClient))
        onProgramAdded?.()
      },
      onError: onCreateDeclaredProgramError
    })
  }

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      organization: '',
      result: '',
      sourceOfInformation: '',
      startDate: '',
      endDate: '',
      isOngoing: false
    } as DeclaredProgramFormData,
    validators: {
      onSubmit ({ value }: { value: DeclaredProgramFormData }) {
        return {
          fields: {
            title: validators.validateTitle(value.title),
            description: validators.validateDescription(value.description),
            organization: validators.validateOrganization(value.organization),
            result: validators.validateResult(value.result),
            sourceOfInformation: validators.validateSourceOfInformation(value.sourceOfInformation),
            startDate: validators.validateStartDate(value.startDate),
            endDate: validators.validateEndDate(value.endDate, value.startDate, { isRequired: !value.isOngoing }),
          }
        }
      }
    },
    onSubmit: ({ value }: { value: DeclaredProgramFormData }) => {
      createDeclaredProgram({
        title: value.title,
        description: value.description || undefined,
        organization: value.organization,
        result: value.result || undefined,
        sourceOfInformation: value.sourceOfInformation || undefined,
        startDate: formatYearMonthToDate(value.startDate),
        endDate: value.isOngoing ? undefined : formatYearMonthToDate(value.endDate) || undefined
      })
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating && state.value.isDirty
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending || isLoading.value
  }
}
