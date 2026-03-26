import type { DeclaredProgramDetailedDTO, DeclaredProgramRequestDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { DeclaredProgramFormData } from '@/features/student/personalCareer/types/forms.types'
import { formatDateToYearMonth, formatYearMonthToDate } from '@/common/utils'
import { useDeclaredProgramFormValidators } from '@/features/student/personalCareer/composables/use-declared-program-form-validators/use-declared-program-form-validators'
import { useUpdateDeclaredProgramMutation } from '@/features/student/personalCareer/queries/use-declared-programs.query'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
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
    isOngoing: !dto.endDate
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
    endDate: value.isOngoing ? undefined : formatYearMonthToDate(value.endDate)
  }
}

export function useUpdateDeclaredProgramForm (
  declaredProgramDetailed: DeclaredProgramDetailedDTO,
  onProgramUpdated?: () => void
) {
  const { t } = useI18n()
  const { addErrorMessage, addSuccessMessage } = useToasterStore()

  const onUpdateDeclaredProgramError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.personalCareer.views.DeclaredProgramUpdateView.updateForm.errors.updateDeclaredProgram'),
      description: error.message
    })
  }

  const validators = useDeclaredProgramFormValidators()

  const { mutate: updateDeclaredProgram, isPending } = useUpdateDeclaredProgramMutation({
    onError: onUpdateDeclaredProgramError,
    onSuccess: () => {
      addSuccessMessage({
        timeout: 2000,
        description: t('student.personalCareer.views.DeclaredProgramUpdateView.updateForm.success')
      })
      onProgramUpdated?.()
    }
  })

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
            endDate: validators.validateEndDate(value.endDate, value.startDate, { isRequired: !value.isOngoing })
          }
        }
      }
    },
    onSubmit: ({ value }: { value: DeclaredProgramFormData }) => {
      updateDeclaredProgram({
        declaredProgramId: declaredProgramDetailed.id,
        declaredProgramRequestDTO: toRequestDTO(value)
      })
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(s => s)
    return state.value.isDirty && state.value.isValid && !state.value.isValidating
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending
  }
}
