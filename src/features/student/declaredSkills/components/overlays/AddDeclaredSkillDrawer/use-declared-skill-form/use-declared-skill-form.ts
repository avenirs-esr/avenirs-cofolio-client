import type { BaseApiException } from '@/common/exceptions'
import type { DeclaredSkillFormData } from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/types'
import type { Association } from '@/features/student/global/types/associations.types'
import {
  EDeclaredSkillLevel,
  EErrorCode,
  invalidateGetDeclaredSkillsProgresses,
  useAssociateActivityWithDeclaredSkills,
  useAssociateDeclaredExperienceWithDeclaredSkills,
  useCreateDeclaredSkillProgress
} from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { DECLARED_SKILL_REFLECTION_MAX_LENGTH } from '@/features/student/declaredSkills/config'
import { EAssociationTypeKey } from '@/features/student/traces/types/traces.types'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export function useDeclaredSkillForm (onSkillAdded?: () => void) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()
  const { validateRequired, validateMaxLength, hasFieldErrors } = useFormValidators()

  const onCreateDeclaredSkillError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.errors.createDeclaredSkill'),
      description: error.code === EErrorCode.STUDENT_DECLARED_ALREADY_EXIST
        ? t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.errors.declaredSkillAlreadyExist')
        : getErrorMessage(error)
    })
  }

  const { mutate: mutateCreateDeclaredSkillProgress, isPending } = useCreateDeclaredSkillProgress()

  const { mutateAsync: associateWithActivities, isPending: isPendingAssociateWithActivities } = useAssociateActivityWithDeclaredSkills({
    mutation: {
      onError: (error: BaseApiException) => {
        addErrorMessage({
          title: t('global.error.generic'),
          description: getErrorMessage(error),
        })
      }
    }
  })

  const { mutateAsync: associateWithExperiences, isPending: isPendingAssociateWithExperiences } = useAssociateDeclaredExperienceWithDeclaredSkills({
    mutation: {
      onError: (error: BaseApiException) => {
        addErrorMessage({
          title: t('global.error.generic'),
          description: getErrorMessage(error),
        })
      }
    }
  })

  function createAssociateSkillPromises (skillId: string, associationsByType: Record<string, Association[]>): Promise<unknown>[] {
    return Object.entries(associationsByType).flatMap(([type, associations]) => {
      switch (type) {
        case EAssociationTypeKey.ACTIVITIES:
          return associations.map(association => associateWithActivities({ declaredActivityId: association.id, data: { idsToAssociate: [skillId] } }))
        case EAssociationTypeKey.DECLARED_EXPERIENCES:
          return associations.map(association => associateWithExperiences({ experienceId: association.id, data: { idsToAssociate: [skillId] } }))
        default:
          return []
      }
    })
  }

  function createDeclaredSkill (value: DeclaredSkillFormData) {
    const selectedSkill = value.selectedSkills[0]
    mutateCreateDeclaredSkillProgress({
      data: {
        id: selectedSkill.id,
        type: selectedSkill.type,
        level: value.level,
        reflection: value.reflection
      }
    }, {
      onError: onCreateDeclaredSkillError,
      onSuccess: async (skill) => {
        const promises: Promise<unknown>[] = value.associationSelections ? createAssociateSkillPromises(skill.id, value.associationSelections) : []

        promises.push(invalidateGetDeclaredSkillsProgresses(queryClient))

        await withTaskLoading(() => Promise.allSettled(promises))
        onSkillAdded?.()
      }
    })
  }

  const form = useForm({
    defaultValues: {
      selectedSkills: [],
      level: EDeclaredSkillLevel.BEGINNER,
      associationSelections: {}
    } as unknown as DeclaredSkillFormData,
    validators: {
      onChange ({ value }: { value: DeclaredSkillFormData }) {
        return {
          fields: {
            reflection: validateMaxLength(value.reflection, DECLARED_SKILL_REFLECTION_MAX_LENGTH)
          }
        }
      },
      onSubmit ({ value }: { value: DeclaredSkillFormData }) {
        return {
          fields: {
            selectedSkills: (!value.selectedSkills || value.selectedSkills.length === 0)
              ? t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.validation.skillRequired')
              : undefined,
            level: !value.level
              ? t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.validation.levelRequired')
              : undefined,
            reflection: validateRequired(value.reflection)
          }
        }
      }
    },
    onSubmit: ({ value }: { value: DeclaredSkillFormData }) => {
      createDeclaredSkill(value)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating
  })

  const hasSkillDetailsErrors = hasFieldErrors(form, ['reflection'])

  return {
    form,
    isFormValid,
    isSubmitting: isPending || isLoading.value || isPendingAssociateWithActivities.value || isPendingAssociateWithExperiences.value,
    hasSkillDetailsErrors
  }
}

export type DeclaredSkillForm = ReturnType<typeof useDeclaredSkillForm>['form']
