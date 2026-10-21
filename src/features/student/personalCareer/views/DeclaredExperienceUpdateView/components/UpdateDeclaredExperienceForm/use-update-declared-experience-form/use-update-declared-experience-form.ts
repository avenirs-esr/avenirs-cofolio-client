import type { DeclaredExperienceRequest, DeclaredExperienceViewDTO, EExperienceType } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { DeclaredExperienceFormData, DeclaredExperienceFormDataApi } from '@/features/student/personalCareer/types/forms.types'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { invalidateGetDeclaredExperience, invalidateGetDeclaredExperienceView, useUpdateDeclaredExperience } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useDeclaredExperienceFormValidators } from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { useToasterStore } from '@/store'

function toFormData (dto: DeclaredExperienceViewDTO): DeclaredExperienceFormData {
  return {
    title: dto.title,
    type: dto.experienceType ?? '',
    organization: dto.organization,
    activitySector: dto.activitySector ?? '',
    location: dto.location ?? '',
    result: dto.result ?? '',
    startDate: dto.startDate ?? '',
    endDate: dto.endDate ?? '',
    isOngoing: !dto.endDate,
    sourceOfInformation: dto.sourceOfInformation ?? '',
    description: dto.description ?? '',
    summary: dto.summary ?? '',
    externalLink: dto.externalLink ?? '',
    valorized: dto.valorized ?? false
  }
}

function toRequestDTO (value: DeclaredExperienceFormData): DeclaredExperienceRequest {
  return {
    title: value.title,
    experienceType: value.type as EExperienceType,
    organization: value.organization,
    activitySector: value.activitySector || undefined,
    location: value.location || undefined,
    result: value.result || undefined,
    description: value.description || undefined,
    sourceOfInformation: value.sourceOfInformation || undefined,
    summary: value.summary || undefined,
    externalLink: value.externalLink || undefined,
    startDate: value.startDate,
    endDate: value.isOngoing ? undefined : value.endDate || undefined,
    valorized: value.valorized
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
      onChange ({
        value,
        formApi,
      }: {
        value: DeclaredExperienceFormData
        formApi: DeclaredExperienceFormDataApi
      }) {
        const isTouched = (field: keyof DeclaredExperienceFormData) =>
          formApi.getFieldMeta(field)?.isTouched ?? true

        const startDateError = validators.validateStartDate(value.startDate)

        return {
          fields: {
            title: isTouched('title')
              ? validators.validateTitle(value.title)
              : undefined,

            type: isTouched('type')
              ? validators.validateTypeRequired(value.type)
              : undefined,

            organization: isTouched('organization')
              ? validators.validateOrganization(value.organization)
              : undefined,

            activitySector: isTouched('activitySector')
              ? validators.validateActivitySector(value.activitySector)
              : undefined,

            location: isTouched('location')
              ? validators.validateLocation(value.location)
              : undefined,

            result: isTouched('result')
              ? validators.validateResult(value.result)
              : undefined,

            startDate: isTouched('startDate')
              ? startDateError
              : undefined,

            endDate:
        isTouched('endDate') && !startDateError
          ? validators.validateEndDate(
              value.endDate,
              value.startDate,
              { isRequired: !value.isOngoing }
            )
          : undefined,

            sourceOfInformation: isTouched('sourceOfInformation')
              ? validators.validateSourceOfInformation(value.sourceOfInformation)
              : undefined,

            description: isTouched('description')
              ? validators.validateDescription(value.description)
              : undefined,

            summary: isTouched('summary')
              ? validators.validateSummary(value.summary)
              : undefined,

            externalLink: isTouched('externalLink')
              ? validators.validateExternalLink(value.externalLink)
              : undefined,
          },
        }
      },
      onBlur: ({ formApi }) => {
        formApi.validate('change')
      },
      onSubmit ({ value }: { value: DeclaredExperienceFormData }) {
        return {
          fields: {
            title: validators.validateTitle(value.title),
            type: validators.validateTypeRequired(value.type),
            organization: validators.validateOrganization(value.organization),
            activitySector: validators.validateActivitySector(value.activitySector),
            location: validators.validateLocation(value.location),
            result: validators.validateResult(value.result),
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
    isSubmitting: computed(() => isPending.value || isLoading.value)
  }
}
