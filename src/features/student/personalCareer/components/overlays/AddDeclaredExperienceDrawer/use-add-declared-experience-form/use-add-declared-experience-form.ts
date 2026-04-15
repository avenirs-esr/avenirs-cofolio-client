import type { EExperienceType } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import { formatYearMonthToDate } from '@/common/utils'
import { useDeclaredExperienceFormValidators } from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { useCreateDeclaredExperienceMutation } from '@/features/student/personalCareer/queries/use-declared-experiences.query'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export function useAddDeclaredExperienceForm (onExperienceAdded?: () => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()

  const onCreateDeclaredExperienceError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.errors.createDeclaredExperience'),
      description: error.message
    })
  }

  const validators = useDeclaredExperienceFormValidators()

  const { mutate: createDeclaredExperience, isPending } = useCreateDeclaredExperienceMutation({ onError: onCreateDeclaredExperienceError })

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
      }, {
        onSuccess: () => {
          onExperienceAdded?.()
        }
      })
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isDirty && state.value.isValid && !state.value.isValidating
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending
  }
}
