import type { BaseApiException } from '@/common/exceptions'
import type { DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import { type DeclaredExperienceViewDTO, type EExperienceType, invalidateGetDeclaredExperienceView, useCreateDeclaredExperience } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { formatYearMonthToDate } from '@/common/utils'
import { useDeclaredExperienceFormValidators } from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export function useAddDeclaredExperienceForm (onExperienceAdded?: () => void) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  const onCreateDeclaredExperienceError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.errors.createDeclaredExperience'),
      description: getErrorMessage(error)
    })
  }

  const validators = useDeclaredExperienceFormValidators()

  const { mutate: mutateCreateDeclaredExperience, isPending } = useCreateDeclaredExperience()

  function createDeclaredExperience (data: DeclaredExperienceViewDTO) {
    mutateCreateDeclaredExperience({ data }, {
      onSuccess: async () => {
        await withTaskLoading(() => invalidateGetDeclaredExperienceView(queryClient))
        onExperienceAdded?.()
      },
      onError: onCreateDeclaredExperienceError
    })
  }

  const form = useForm({
    defaultValues: {
      title: '',
      type: '',
      organization: '',
      activitySector: '',
      location: '',
      startDate: '',
      endDate: '',
      isOngoing: false,
      sourceOfInformation: '',
      description: '',
      summary: '',
      externalLink: ''
    } as DeclaredExperienceFormData,
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
            externalLink: validators.validateExternalLinkMaxLength(value.externalLink)
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
      createDeclaredExperience({
        title: value.title,
        experienceType: value.type as EExperienceType || undefined,
        organization: value.organization,
        activitySector: value.activitySector || undefined,
        location: value.location || undefined,
        description: value.description || undefined,
        sourceOfInformation: value.sourceOfInformation || undefined,
        summary: value.summary || undefined,
        externalLink: value.externalLink || undefined,
        startDate: formatYearMonthToDate(value.startDate),
        endDate: value.isOngoing ? undefined : formatYearMonthToDate(value.endDate) || undefined
      } as DeclaredExperienceViewDTO)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isDirty && state.value.isValid && !state.value.isValidating
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending || isLoading.value
  }
}
