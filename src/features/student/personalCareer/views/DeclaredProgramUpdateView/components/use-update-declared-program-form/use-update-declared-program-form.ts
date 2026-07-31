import type { BaseApiException } from '@/common/exceptions'
import type { DeclaredProgramFormApi, DeclaredProgramFormData } from '@/features/student/personalCareer/types/forms.types'
import { type DeclaredProgramDetailedDTO, type DeclaredProgramRequestDTO, invalidateGetDeclaredPrograms, useUpdateDeclaredProgram } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { formatDateToYearMonth, formatYearMonthToDate } from '@/common/utils'
import { useDeclaredProgramFormValidators } from '@/features/student/personalCareer/composables/use-declared-program-form-validators/use-declared-program-form-validators'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

function toFormData (dto: DeclaredProgramDetailedDTO): DeclaredProgramFormData {
  return {
    title: dto.title ?? '',
    description: dto.description ?? '',
    organization: dto.organization ?? '',
    result: dto.result ?? '',
    sourceOfInformation: (dto.sourceOfInformation ?? ''),
    startDate: formatDateToYearMonth(dto.startDate) ?? '',
    endDate: dto.endDate ? formatDateToYearMonth(dto.endDate) : '',
    isOngoing: !dto.endDate,
    valorized: dto.valorized ?? false
  }
}

function toRequestDTO (value: DeclaredProgramFormData): DeclaredProgramRequestDTO {
  return {
    title: value.title,
    description: value.description || undefined,
    organization: value.organization,
    result: value.result || undefined,
    sourceOfInformation: value.sourceOfInformation || undefined,
    startDate: formatYearMonthToDate(value.startDate),
    endDate: value.isOngoing ? undefined : formatYearMonthToDate(value.endDate),
    valorized: value.valorized
  }
}

export function useUpdateDeclaredProgramForm (
  declaredProgramDetailed: DeclaredProgramDetailedDTO,
  onProgramUpdated?: () => void
) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage, addSuccessMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  const onUpdateDeclaredProgramError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.personalCareer.views.DeclaredProgramUpdateView.updateForm.errors.updateDeclaredProgram'),
      description: getErrorMessage(error)
    })
  }

  const validators = useDeclaredProgramFormValidators()

  const { mutate: mutateUpdateDeclaredProgram, isPending } = useUpdateDeclaredProgram()

  function updateDeclaredProgram (value: DeclaredProgramFormData) {
    mutateUpdateDeclaredProgram({
      declaredProgramId: declaredProgramDetailed.id,
      data: toRequestDTO(value)
    }, {
      onSuccess: async () => {
        await withTaskLoading(() => invalidateGetDeclaredPrograms(queryClient))
        addSuccessMessage({
          timeout: 2000,
          description: t('student.personalCareer.views.DeclaredProgramUpdateView.updateForm.success')
        })
        onProgramUpdated?.()
      },
      onError: onUpdateDeclaredProgramError
    })
  }

  const form = useForm({
    defaultValues: toFormData(declaredProgramDetailed),
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
      updateDeclaredProgram(value)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(s => s)
    return state.value.isDirty && state.value.isValid && !state.value.isValidating
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending || isLoading.value
  }
}
