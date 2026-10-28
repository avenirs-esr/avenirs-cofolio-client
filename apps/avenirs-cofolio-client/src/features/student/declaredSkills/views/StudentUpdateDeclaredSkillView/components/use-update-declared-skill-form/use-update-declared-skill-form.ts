import type { BaseApiException } from '@avenirs-esr/shared'
import type { SkillProgressDetailsDTO, SkillProgressRequest } from '@/api/avenir-esr'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { invalidateGetSkillProgressDetails, useUpdateSkillProgress } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { DECLARED_SKILL_REFLECTION_MAX_LENGTH } from '@/features/student/declaredSkills/config'
import { useToasterStore } from '@/store'

function normalize (dto: SkillProgressDetailsDTO): SkillProgressDetailsDTO {
  return {
    ...dto,
    reflection: (dto.reflection ?? '').slice(0, DECLARED_SKILL_REFLECTION_MAX_LENGTH),
  }
}

export function useUpdateDeclaredSkillForm (
  declaredSkillProgressDetails: SkillProgressDetailsDTO,
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

  const { mutate: mutateUpdateDeclaredSkillProgress, isPending } = useUpdateSkillProgress()

  function updateDeclaredSkill (declaredSkillProgressDetails: SkillProgressDetailsDTO) {
    const data: SkillProgressRequest = {
      level: declaredSkillProgressDetails.level,
      reflection: declaredSkillProgressDetails.reflection ?? '',
      valorized: declaredSkillProgressDetails.valorized,
    }

    mutateUpdateDeclaredSkillProgress({ skillProgressId: declaredSkillProgressDetails.id, data }, {
      onError: onUpdateDeclaredSkillError,
      onSuccess: async () => {
        addSuccessMessage(t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.updateForm.success'))
        onSkillUpdated?.()
        await withTaskLoading(() => invalidateGetSkillProgressDetails(queryClient, declaredSkillProgressDetails.id))
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
    isSubmitting: computed(() => isPending.value || isLoading.value)
  }
}

export type UpdateDeclaredSkillForm = ReturnType<typeof useUpdateDeclaredSkillForm>['form']
