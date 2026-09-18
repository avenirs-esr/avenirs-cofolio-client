import type { BaseApiException } from '@/common/exceptions'
import type { Association } from '@/features/student/global/types/associations.types'
import type { DeclaredExperienceAssociationContextType } from '@/features/student/personalCareer/types/declared-experience.types'
import type {
  DeclaredExperienceFormData

} from '@/features/student/personalCareer/types/forms.types'
import { type DeclaredExperienceViewDTO, EAssociationContextType, type EExperienceType, invalidateGetDeclaredExperienceView, useAssociate, useCreateDeclaredExperience } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { formatYearMonthToDate } from '@/common/utils'
import { useDeclaredExperienceFormValidators } from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

function getIdsForType (associationSelections: Partial<Record<DeclaredExperienceAssociationContextType, Association[]>>, associationType: DeclaredExperienceAssociationContextType): string[] {
  return (associationSelections[associationType] ?? []).map(item => item.id)
}

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

  const {
    mutateAsync: associateDeclaredExperience,
    isPending: isPendingAssociate
  } = useAssociate({
    mutation: {
      onError: (error: BaseApiException) => {
        addErrorMessage({
          title: t('global.error.generic'),
          description: getErrorMessage(error),
        })
      }
    }
  })

  function associateWithContextType (
    experienceId: string,
    associationSelections: Partial<Record<DeclaredExperienceAssociationContextType, Association[]>>,
    associatedContextType: DeclaredExperienceAssociationContextType
  ): Promise<unknown>[] {
    const idsToAssociate = getIdsForType(associationSelections, associatedContextType)

    if (idsToAssociate.length === 0) {
      return []
    }

    return [associateDeclaredExperience({
      contextType: EAssociationContextType.DECLARED_EXPERIENCE,
      elementId: experienceId,
      associatedContextType,
      data: { idsToAssociate }
    })]
  }

  function createDeclaredExperience (data: DeclaredExperienceViewDTO, associationSelections: Partial<Record<DeclaredExperienceAssociationContextType, Association[]>>) {
    mutateCreateDeclaredExperience({ data }, {
      onSuccess: async (createdExperience) => {
        const promises: Promise<unknown>[] = [invalidateGetDeclaredExperienceView(queryClient)]

        promises.push(...associateWithContextType(createdExperience.id, associationSelections, EAssociationContextType.DECLARED_SKILL))
        promises.push(...associateWithContextType(createdExperience.id, associationSelections, EAssociationContextType.TRACE))

        await withTaskLoading(() => Promise.allSettled(promises))
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
      onChange ({ value }: { value: DeclaredExperienceFormData }) {
        return {
          fields: {
            title: validators.validateTitleMaxLength(value.title),
            type: validators.validateTypeRequired(value.type),
            organization: validators.validateOrganizationMaxLength(value.organization),
            activitySector: validators.validateActivitySector(value.activitySector),
            location: validators.validateLocation(value.location),
            result: validators.validateResult(value.result),
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
        startDate: formatYearMonthToDate(value.startDate),
        endDate: value.isOngoing ? undefined : formatYearMonthToDate(value.endDate) || undefined
      } as DeclaredExperienceViewDTO, value.associationSelections ?? {})
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isDirty && state.value.isValid && !state.value.isValidating
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending || isPendingAssociate || isLoading.value
  }
}
