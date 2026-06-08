import type { BaseApiException } from '@/common/exceptions'
import type { DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import { type DeclaredExperienceRequest, type DeclaredExperienceViewDTO, type EExperienceType, invalidateGetDeclaredExperience, invalidateGetDeclaredExperienceView, useUpdateDeclaredExperience } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { formatDateToYearMonth, formatYearMonthToDate } from '@/common/utils'
import { useDeclaredExperienceFormValidators } from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

function toFormData (dto: DeclaredExperienceViewDTO): DeclaredExperienceFormData {
  return {
    title: dto.title,
    type: dto.experienceType ?? '',
    organization: dto.organization,
    activitySector: dto.activitySector ?? '',
    location: dto.location ?? '',
    startDate: formatDateToYearMonth(dto.startDate) ?? '',
    endDate: dto.endDate ? formatDateToYearMonth(dto.endDate) : '',
    isOngoing: !dto.endDate,
    sourceOfInformation: dto.sourceOfInformation ?? '',
    description: dto.description ?? '',
    summary: dto.summary ?? '',
    externalLink: dto.externalLink ?? ''
  }
}

function toRequestDTO (value: DeclaredExperienceFormData): DeclaredExperienceRequest {
  return {
    title: value.title,
    experienceType: value.type ? value.type as EExperienceType : undefined,
    organization: value.organization,
    activitySector: value.activitySector || undefined,
    location: value.location || undefined,
    description: value.description || undefined,
    sourceOfInformation: value.sourceOfInformation || undefined,
    summary: value.summary || undefined,
    externalLink: value.externalLink || undefined,
    startDate: formatYearMonthToDate(value.startDate),
    endDate: value.isOngoing ? undefined : formatYearMonthToDate(value.endDate) || undefined
  }
}

export function useUpdateDeclaredExperienceForm (
  declaredExperience: DeclaredExperienceViewDTO,
  onExperienceUpdated?: () => void
) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage, addSuccessMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  const onUpdateDeclaredExperienceError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.personalCareer.views.DeclaredExperienceUpdateView.updateForm.errors.updateDeclaredExperience'),
      description: getErrorMessage(error)
    })
  }

  const validators = useDeclaredExperienceFormValidators()

  const { mutate: mutateUpdateDeclaredExperience, isPending } = useUpdateDeclaredExperience()

  function updateDeclaredExperience (value: DeclaredExperienceFormData) {
    mutateUpdateDeclaredExperience({ experienceId: declaredExperience.id, data: toRequestDTO(value) }, {
      onError: onUpdateDeclaredExperienceError,
      onSuccess: async (_, variables) => {
        await withTaskLoading(() => Promise.all([
          invalidateGetDeclaredExperienceView(queryClient),
          invalidateGetDeclaredExperience(queryClient, variables.experienceId)
        ]))

        addSuccessMessage({
          timeout: 2000,
          description: t('student.personalCareer.views.DeclaredExperienceUpdateView.updateForm.success')
        })
        onExperienceUpdated?.()
      }
    })
  }

  const form = useForm({
    defaultValues: toFormData(declaredExperience),
    validators: {
      onChange ({ value }: { value: DeclaredExperienceFormData }) {
        return {
          fields: {
            title: validators.validateTitleMaxLength(value.title),
            organization: validators.validateOrganizationMaxLength(value.organization),
            activitySector: validators.validateActivitySector(value.activitySector),
            location: validators.validateLocation(value.location),
            sourceOfInformation: validators.validateSourceOfInformation(value.sourceOfInformation),
            description: validators.validateDescription(value.description),
            summary: validators.validateSummary(value.summary),
            externalLink: validators.validateExternalLink(value.externalLink)
          }
        }
      },
      onSubmit ({ value }: { value: DeclaredExperienceFormData }) {
        return {
          fields: {
            title: validators.validateTitle(value.title),
            organization: validators.validateOrganization(value.organization),
            activitySector: validators.validateActivitySector(value.activitySector),
            location: validators.validateLocation(value.location),
            startDate: validators.validateStartDate(value.startDate),
            endDate: validators.validateEndDate(value.endDate, value.startDate, { isRequired: !value.isOngoing }),
            sourceOfInformation: validators.validateSourceOfInformation(value.sourceOfInformation),
            description: validators.validateDescription(value.description),
            summary: validators.validateSummary(value.summary),
            externalLink: validators.validateExternalLink(value.externalLink)
          }
        }
      }
    },
    onSubmit: ({ value }: { value: DeclaredExperienceFormData }) => {
      updateDeclaredExperience(value)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(s => s)
    return state.value.isValid && !state.value.isValidating && state.value.isDirty
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending || isLoading.value
  }
}
