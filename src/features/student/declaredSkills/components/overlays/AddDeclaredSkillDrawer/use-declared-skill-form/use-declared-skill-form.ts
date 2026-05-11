import type { BaseApiException } from '@/common/exceptions'
import type { DeclaredSkillFormData } from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/types'
import { EDeclaredSkillLevel, EErrorCode, invalidateGetDeclaredSkillsProgresses, useCreateDeclaredSkillProgress } from '@/api/avenir-esr'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { DECLARED_SKILL_REFLECTION_MAX_LENGTH } from '@/features/student/declaredSkills/config'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export function useDeclaredSkillForm (onSkillAdded?: () => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()
  const { validateRequired, validateMaxLength, hasFieldErrors } = useFormValidators()

  const onCreateDeclaredSkillError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.errors.createDeclaredSkill'),
      description: error.code === EErrorCode.STUDENT_DECLARED_ALREADY_EXIST ? t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.errors.declaredSkillAlreadyExist') : error.message
    })
  }

  const { mutate: mutateCreateDeclaredSkillProgress, isPending } = useCreateDeclaredSkillProgress()

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
      onSuccess: async () => {
        await withTaskLoading(() => invalidateGetDeclaredSkillsProgresses(queryClient))
        onSkillAdded?.()
      }
    })
  }

  const form = useForm({
    defaultValues: {
      selectedSkills: [],
      level: EDeclaredSkillLevel.BEGINNER
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
    isSubmitting: isPending || isLoading.value,
    hasSkillDetailsErrors
  }
}

export type DeclaredSkillForm = ReturnType<typeof useDeclaredSkillForm>['form']
