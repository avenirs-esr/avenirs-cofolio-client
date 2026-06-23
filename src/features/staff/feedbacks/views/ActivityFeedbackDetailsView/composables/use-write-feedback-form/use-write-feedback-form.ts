import type { BaseApiException } from '@/common/exceptions'
import type { WriteFeedbackFormApi, WriteFeedbackFormData } from '@/features/staff/feedbacks/types/forms.types'
import { EUserCategory, type FeedbackDetailsDTO, invalidateGetFeedbackDetails, type UpdateFeedbackRequest, useUpdateFeedback } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useWriteFeedbackFormValidators } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/composables/use-write-feedback-form-validators/use-write-feedback-form-validators'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { type MaybeRef, toValue } from 'vue'
import { useI18n } from 'vue-i18n'

export function useWriteFeedbackForm (feedback?: MaybeRef<FeedbackDetailsDTO | undefined>, onFeedbackSaved?: () => void) {
  const { t } = useI18n()

  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const { hasFieldErrors } = useFormValidators()

  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()
  const onSendFeedbackError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('staff.feedbacks.views.ActivityFeedbackDetailsView.WriteFeedbackFloatingPanel.tabs.write.errors.saveFeedback'),
      description: getErrorMessage(error)
    })
  }

  const { validateFeedback } = useWriteFeedbackFormValidators()

  const form = useForm({
    defaultValues: { feedback: toValue(feedback)?.feedback ?? '' } as WriteFeedbackFormData,
    validators: {
      onSubmit ({ value }: { value: WriteFeedbackFormData }) {
        return {
          fields: {
            feedback: validateFeedback(value.feedback),
          }
        }
      },
      onChange ({ value, formApi }: { value: WriteFeedbackFormData, formApi: WriteFeedbackFormApi }) {
        const isTouched = (field: keyof WriteFeedbackFormData) => formApi.getFieldMeta(field)?.isTouched ?? true
        return {
          fields: {
            feedback: isTouched('feedback') ? validateFeedback(value.feedback) : undefined,
          }
        }
      },
      onBlur ({ formApi }: { formApi: WriteFeedbackFormApi }) {
        formApi.validate('change')
      }
    },
    onSubmit: ({ value }: { value: WriteFeedbackFormData }) => {
      updateFeedback({ feedback: value.feedback })
    }
  })

  const { mutate: mutateUpdateFeedback, isPending } = useUpdateFeedback()

  function updateFeedback (value: UpdateFeedbackRequest) {
    const currentFeedback = toValue(feedback)

    if (!currentFeedback?.id) {
      return
    }

    mutateUpdateFeedback({ feedbackId: currentFeedback.id, data: value }, {
      onSuccess: async () => {
        form.reset({ feedback: value.feedback } as WriteFeedbackFormData)
        await withTaskLoading(() => invalidateGetFeedbackDetails(queryClient, EUserCategory.STAFF, currentFeedback.id))
        onFeedbackSaved?.()
      },
      onError: onSendFeedbackError
    })
  }

  watch(
    () => toValue(feedback),
    (currentFeedback) => {
      form.reset({ feedback: currentFeedback?.feedback ?? '' } as WriteFeedbackFormData)
    }
  )

  const hasErrors = hasFieldErrors(form, ['feedback'])

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating && state.value.isDirty
  })

  const isDirty = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isDirty
  })

  function handleCancel () {
    form.reset()
  }

  return {
    form,
    isFormValid,
    isSubmitting: isPending || isLoading.value,
    hasErrors,
    isDirty,
    handleCancel
  }
}
