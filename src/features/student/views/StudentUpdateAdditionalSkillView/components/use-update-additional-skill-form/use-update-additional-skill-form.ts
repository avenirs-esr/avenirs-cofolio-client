import type { BaseApiException } from '@/common/exceptions'
import type {
  AdditionalSkillProgressDetailsDTO
} from '@/features/student/views/StudentAdditionalSkillView/components/AdditionalSkillDetails/AdditionalSkillDetails.types'
import { useUpdateAdditionalSkillMutation } from '@/features/student/queries'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export function useUpdateAdditionalSkillForm (
  additionalSkillProgressDetails: AdditionalSkillProgressDetailsDTO,
  onSkillUpdated?: () => void
) {
  const { t } = useI18n()
  const { addErrorMessage, addSuccessMessage } = useToasterStore()

  const onUpdateAdditionalSkillError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.views.studentUpdateAdditionalSkillView.updateForm.errors.updateAdditionalSkill'),
      description: error.message
    })
  }

  const { mutate: updateAdditionalSkill, isPending } = useUpdateAdditionalSkillMutation({
    onError: onUpdateAdditionalSkillError,
    onSuccess: () => {
      addSuccessMessage?.(t('student.views.studentUpdateAdditionalSkillView.updateForm.success'))
      onSkillUpdated?.()
    }
  })

  const form = useForm({
    defaultValues: {
      ...additionalSkillProgressDetails,
    },
    validators: {
      onSubmit ({ value }) {
        return {
          fields: {
            level: (value.level == null)
              ? t('student.views.studentUpdateAdditionalSkillView.updateForm.validation.levelRequired')
              : undefined,
            comment: (value.comment && value.comment.length > 400)
              ? t('student.views.studentUpdateAdditionalSkillView.updateForm.validation.commentTooLong', 400)
              : undefined
          }
        }
      }
    },
    onSubmit: ({ value }) => {
      updateAdditionalSkill(value)
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

export type UpdateAdditionalSkillForm = ReturnType<typeof useUpdateAdditionalSkillForm>['form']
