import type { DeclaredSkillProgressDetailsDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { useUpdateDeclaredSkillMutation } from '@/features/student/declaredSkills/queries/use-declared-skills.query/use-declared-skills.query'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

function normalize (dto: DeclaredSkillProgressDetailsDTO): DeclaredSkillProgressDetailsDTO {
  return {
    ...dto,
    description: (dto.description ?? '').slice(0, 400),
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
            description: (value.description && value.description.length > 400)
              ? t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.updateForm.validation.commentTooLong', 400)
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
