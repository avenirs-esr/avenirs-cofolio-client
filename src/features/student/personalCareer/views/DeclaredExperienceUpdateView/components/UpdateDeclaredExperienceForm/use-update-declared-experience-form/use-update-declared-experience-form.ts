import type { DeclaredExperienceRequest, DeclaredExperienceViewDTO, EExperienceType } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import { formatYearMonthToDate } from '@/common/utils'
import { useDeclaredExperienceFormValidators } from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { useUpdateDeclaredExperienceMutation } from '@/features/student/personalCareer/queries/use-declared-experiences.query'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

function toFormData (dto: DeclaredExperienceViewDTO): DeclaredExperienceFormData {
  return {
    title: dto.title ?? '',
    type: (dto.experienceType ?? ''),
    organization: (dto.organization ?? '').slice(0, 50),
    activitySector: (dto.activitySector ?? '').slice(0, 50),
    location: (dto.location ?? '').slice(0, 50),
    startDate: dto.startDate ?? '',
    endDate: dto.endDate ?? '',
    isOngoing: !dto.endDate,
    sourceOfInformation: (dto.sourceOfInformation ?? '').slice(0, 200),
    description: (dto.description ?? '').slice(0, 400),
    summary: (dto.summary ?? '').slice(0, 400),
    externalLink: (dto.externalLink ?? '').slice(0, 2000)
  }
}

function toRequestDTO (value: DeclaredExperienceFormData): DeclaredExperienceRequest {
  return {
    title: value.title,
    experienceType: value.type as EExperienceType,
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
  const { addErrorMessage, addSuccessMessage } = useToasterStore()

  const onUpdateDeclaredExperienceError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.personalCareer.views.DeclaredExperienceUpdateView.updateForm.errors.updateDeclaredExperience'),
      description: error.message
    })
  }

  const validators = useDeclaredExperienceFormValidators()

  const { mutate: updateDeclaredExperience, isPending } = useUpdateDeclaredExperienceMutation({
    onError: onUpdateDeclaredExperienceError,
    onSuccess: () => {
      addSuccessMessage({
        timeout: 2000,
        description: t('student.personalCareer.views.DeclaredExperienceUpdateView.updateForm.success')
      })
      onExperienceUpdated?.()
    }
  })
  const form = useForm({
    defaultValues: toFormData(declaredExperience),
    validators: {
      onSubmit ({ value }: { value: DeclaredExperienceFormData }) {
        return {
          fields: {
            title: validators.validateTitle(value.title),
            type: validators.validateType(value.type),
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
      updateDeclaredExperience({
        declaredExperienceId: declaredExperience.id,
        declaredExperienceRequestDTO: toRequestDTO(value)
      })
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(s => s)
    return state.value.isValid && !state.value.isValidating && state.value.isDirty
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending
  }
}
