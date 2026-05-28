import type { BaseApiException } from '@/common/exceptions'
import type { DeclaredProgramFormApi, DeclaredProgramFormData } from '@/features/student/personalCareer/types/forms.types'
import { type DeclaredProgramRequestDTO, invalidateGetDeclaredPrograms, useCreateDeclaredProgram } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { formatYearMonthToDate } from '@/common/utils'
import { useDeclaredProgramFormValidators } from '@/features/student/personalCareer/composables/use-declared-program-form-validators/use-declared-program-form-validators'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export function useAddDeclaredProgramForm (onProgramAdded?: () => void) {
  const { t } = useI18n()

  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const { hasFieldErrors } = useFormValidators()

  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()
  const onCreateDeclaredProgramError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.personalCareer.overlays.AddDeclaredProgramDrawer.errors.createDeclaredProgram'),
      description: getErrorMessage(error)
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
      },
      onChange ({ value, formApi }: { value: DeclaredProgramFormData, formApi: DeclaredProgramFormApi }) {
        const isTouched = (field: keyof DeclaredProgramFormData) => formApi.getFieldMeta(field)?.isTouched ?? true
        const isValid = (field: keyof DeclaredProgramFormData) => formApi.getFieldMeta(field)?.isValid ?? true
        return {
          fields: {
            title: isTouched('title') ? validators.validateTitle(value.title) : undefined,
            description: isTouched('description') ? validators.validateDescription(value.description) : undefined,
            organization: isTouched('organization') ? validators.validateOrganization(value.organization) : undefined,
            result: isTouched('result') ? validators.validateResult(value.result) : undefined,
            sourceOfInformation: isTouched('sourceOfInformation') ? validators.validateSourceOfInformation(value.sourceOfInformation) : undefined,
            startDate: isTouched('startDate') ? validators.validateStartDate(value.startDate) : undefined,
            endDate: isTouched('startDate') && isValid('startDate') ? validators.validateEndDate(value.endDate, value.startDate, { isRequired: !value.isOngoing }) : undefined,
          }
        }
      },
      onBlur ({ formApi }: { formApi: DeclaredProgramFormApi }) {
        formApi.validate('change')
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

  const hasDefinitionItemsError = hasFieldErrors(form, ['title', 'description', 'organization', 'result', 'sourceOfInformation', 'startDate', 'endDate'])

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating && state.value.isDirty
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending || isLoading.value,
    hasDefinitionItemsError
  }
}
