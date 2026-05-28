import type { BaseApiException } from '@/common/exceptions'
import { type DeclaredSkillProgressDetailsDTO, type DeclaredSkillProgressRequest, invalidateGetDeclaredSkillProgressDetails, useUpdateDeclaredSkillProgress } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { DECLARED_SKILL_REFLECTION_MAX_LENGTH } from '@/features/student/declaredSkills/config'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
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
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage, addSuccessMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  const onUpdateDeclaredSkillError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.updateForm.errors.updateDeclaredSkill'),
      description: getErrorMessage(error)
    })
  }

  const { mutate: mutateUpdateDeclaredSkillProgress, isPending } = useUpdateDeclaredSkillProgress()

  function updateDeclaredSkill (declaredSkillProgressDetails: DeclaredSkillProgressDetailsDTO) {
    const data: DeclaredSkillProgressRequest = {
      level: declaredSkillProgressDetails.level,
      reflection: declaredSkillProgressDetails.reflection ?? '',
    }

    mutateUpdateDeclaredSkillProgress({ declaredSkillProgressId: declaredSkillProgressDetails.id, data }, {
      onError: onUpdateDeclaredSkillError,
      onSuccess: async () => {
        addSuccessMessage(t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.updateForm.success'))
        onSkillUpdated?.()
        await withTaskLoading(() => invalidateGetDeclaredSkillProgressDetails(queryClient, declaredSkillProgressDetails.id))
      }
    })
  }

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
    isSubmitting: isPending || isLoading.value
  }
}

export type UpdateDeclaredSkillForm = ReturnType<typeof useUpdateDeclaredSkillForm>['form']
