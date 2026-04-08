import type { DeclaredSkillProgressDetailsDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { DECLARED_SKILL_REFLECTION_MAX_LENGTH } from '@/features/student/declaredSkills/config'
import { useUpdateDeclaredSkillMutation } from '@/features/student/declaredSkills/queries/use-declared-skills.query/use-declared-skills.query'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

function normalize (dto: DeclaredSkillProgressDetailsDTO): DeclaredSkillProgressDetailsDTO {
  return {
    ...dto,
    reflection: (dto.reflection ?? '').slice(0, DECLARED_SKILL_REFLECTION_MAX_LENGTH),
  }
}

export function useUpdateDeclaredSkillForm (
  declaredSkillProgressDetails: DeclaredSkillProgressDetailsDTO,
  onSkillUpdated?: () => void
) {
  const { t } = useI18n()
  const { addErrorMessage, addSuccessMessage } = useToasterStore()

  const onUpdateDeclaredSkillError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.updateForm.errors.updateDeclaredSkill'),
      description: error.message
    })
  }

  const { mutate: updateDeclaredSkill, isPending } = useUpdateDeclaredSkillMutation({
    onError: onUpdateDeclaredSkillError,
    onSuccess: () => {
      addSuccessMessage?.(t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.updateForm.success'))
      onSkillUpdated?.()
    }
  })

  const form = useForm({
    defaultValues: normalize(declaredSkillProgressDetails),
    validators: {
      onSubmit ({ value }) {
        return {
          fields: {
            level: (value.level == null)
              ? t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.updateForm.validation.levelRequired')
              : undefined,
            reflection: (value.reflection && value.reflection.length > DECLARED_SKILL_REFLECTION_MAX_LENGTH)
              ? t('global.error.form.maxLength', DECLARED_SKILL_REFLECTION_MAX_LENGTH)
              : undefined
          }
        }
      }
    },
    onSubmit: ({ value }) => {
      updateDeclaredSkill(value)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(s => s)
    return state.value.isValid && !state.value.isValidating
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending
  }
}

export type UpdateDeclaredSkillForm = ReturnType<typeof useUpdateDeclaredSkillForm>['form']
