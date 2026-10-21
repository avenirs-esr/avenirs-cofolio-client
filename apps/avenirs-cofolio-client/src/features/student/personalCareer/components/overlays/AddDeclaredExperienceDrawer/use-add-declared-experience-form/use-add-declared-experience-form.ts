import type { DeclaredExperienceViewDTO, EExperienceType } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { AssociationSelections } from '@/features/student/associations'
import type {
  DeclaredExperienceFormData

} from '@/features/student/personalCareer/types/forms.types'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { EAssociationContextType, invalidateGetDeclaredExperienceView, useCreateDeclaredExperience } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useAssociationSelections } from '@/features/student/associations'
import { useDeclaredExperienceFormValidators } from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { useToasterStore } from '@/store'

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

  const { associateSelections, notifyAssociationErrors, isAssociating } = useAssociationSelections(EAssociationContextType.DECLARED_EXPERIENCE)

  function createDeclaredExperience (data: DeclaredExperienceViewDTO, associationSelections?: AssociationSelections) {
    mutateCreateDeclaredExperience({ data }, {
      onSuccess: async (createdExperience) => {
        await withTaskLoading(() => Promise.all([
          invalidateGetDeclaredExperienceView(queryClient),
          associateSelections(createdExperience.id, associationSelections).then(notifyAssociationErrors)
        ]))
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
      result: '',
      sourceOfInformation: '',
      description: '',
      summary: '',
      externalLink: '',
      valorized: false,
      associationSelections: {}
    } as DeclaredExperienceFormData,
    validators: {
      onChange: ({ value, formApi }) => {
        const isTouched = (field: keyof DeclaredExperienceFormData) =>
          formApi.getFieldMeta(field)?.isTouched ?? true

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
              ? validators.validateExternalLinkMaxLength(value.externalLink)
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
      createDeclaredExperience({
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
        endDate: value.isOngoing ? undefined : value.endDate || undefined
      } as DeclaredExperienceViewDTO, value.associationSelections)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isDirty && state.value.isValid && !state.value.isValidating
  })

  return {
    form,
    isFormValid,
    isSubmitting: computed(() => isPending.value || isAssociating.value || isLoading.value)
  }
}
