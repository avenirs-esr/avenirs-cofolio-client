import type { BaseApiException } from '@/common/exceptions'
import type { WriteFeedbackFormApi, WriteFeedbackFormData } from '@/features/staff/feedbacks/types/forms.types'
import {
  EUserCategory,
  type FeedbackDetailsDTO,
  invalidateGetFeedbackDetails,
  type UpdateFeedbackRequest,
  useDeleteFeedbackAttachment,
  useUpdateFeedback,
  useUploadFeedbackAttachment
} from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { isFile } from '@/common/utils/file/file'
import { useWriteFeedbackFormValidators } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/composables/use-write-feedback-form-validators/use-write-feedback-form-validators'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { type MaybeRef, toValue } from 'vue'
import { useI18n } from 'vue-i18n'

interface UseWriteFeedbackFormParams {
  feedback?: MaybeRef<FeedbackDetailsDTO | undefined>
  onFeedbackSaved?: () => void
  onCancel?: () => void
}

export function useWriteFeedbackForm ({ feedback, onFeedbackSaved, onCancel }: UseWriteFeedbackFormParams) {
  const { t } = useI18n()

  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const { hasFieldErrors } = useFormValidators()

  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()
  const onSendFeedbackError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.errors.saveFeedback'),
      description: getErrorMessage(error)
    })
  }

  const { validateFeedback, validateAttachments } = useWriteFeedbackFormValidators()

  const form = useForm({
    defaultValues: {
      feedback: toValue(feedback)?.feedback ?? '',
      attachments: toValue(feedback)?.attachments ?? []
    } as WriteFeedbackFormData,
    validators: {
      onSubmit ({ value }: { value: WriteFeedbackFormData }) {
        return {
          fields: {
            feedback: validateFeedback(value.feedback),
            attachments: validateAttachments(value.attachments),
          }
        }
      },
      onChange ({ value, formApi }: { value: WriteFeedbackFormData, formApi: WriteFeedbackFormApi }) {
        const isTouched = (field: keyof WriteFeedbackFormData) => formApi.getFieldMeta(field)?.isTouched ?? true
        return {
          fields: {
            feedback: isTouched('feedback') ? validateFeedback(value.feedback) : undefined,
            attachments: isTouched('attachments') ? validateAttachments(value.attachments) : undefined,
          }
        }
      },
      onBlur ({ formApi }: { formApi: WriteFeedbackFormApi }) {
        formApi.validate('change')
      }
    },
    onSubmit: async ({ value }: { value: WriteFeedbackFormData }) => {
      await updateFeedback({ feedback: value.feedback })
    }
  })

  const initialAttachments = computed(() => toValue(feedback)?.attachments ?? [])
  const formAttachments = form.useStore(state => state.values.attachments ?? [])
  const formFeedback = form.useStore(state => state.values.feedback ?? '')

  const { mutateAsync: mutateUpdateFeedback, isPending } = useUpdateFeedback({
    mutation: {
      onError: onSendFeedbackError
    }
  })
  const { mutateAsync: mutateUploadAttachment, isPending: isUploadingAttachment } = useUploadFeedbackAttachment({
    mutation: {
      onError: (error: BaseApiException) => {
        addErrorMessage({
          title: t('global.error.fileUpload'),
          description: getErrorMessage(error)
        })
      }
    }
  })

  const { mutateAsync: mutateDeleteAttachment, isPending: isDeletingAttachment } = useDeleteFeedbackAttachment()

  function resetForm () {
    form.reset({
      feedback: toValue(feedback)?.feedback ?? '',
      attachments: initialAttachments.value
    })
  }

  async function syncAttachments (feedbackId: string) {
    const addedFiles = formAttachments.value.filter(isFile)

    const removedAttachments = initialAttachments.value.filter(
      initial => !formAttachments.value.some(attachment =>
        !isFile(attachment) && attachment.id === initial.id)
    )

    if (!addedFiles.length && !removedAttachments.length) {
      return
    }

    const promises: Promise<unknown>[] = []

    promises.push(
      ...addedFiles.map(file => mutateUploadAttachment({ feedbackId, data: { file } }))
    )
    promises.push(
      ...removedAttachments.map(initial => mutateDeleteAttachment({ feedbackId, attachmentId: initial.id }))
    )

    await Promise.allSettled(promises)
  }

  async function updateFeedback (
    value: UpdateFeedbackRequest,
    onSuccess?: () => void
  ) {
    const currentFeedback = toValue(feedback)

    if (!currentFeedback?.id) {
      return
    }

    await Promise.allSettled([
      mutateUpdateFeedback({ feedbackId: currentFeedback.id, data: value }),
      syncAttachments(currentFeedback.id)
    ])
      .then(async () => {
        await withTaskLoading(() => invalidateGetFeedbackDetails(queryClient, EUserCategory.STAFF, currentFeedback.id))
        resetForm()
        onFeedbackSaved?.()
        onSuccess?.()
      })
  }

  const hasErrors = hasFieldErrors(form, ['feedback', 'attachments'])

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating
  })

  const isDirty = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isDirty
  })

  const isSubmitting = computed(
    () => isPending.value || isUploadingAttachment.value || isDeletingAttachment.value || isLoading.value
  )

  async function handleCancel () {
    const formState = form.useStore(state => state)

    if (formState.value.isDirty && formFeedback.value.trim() !== '') {
      await updateFeedback({ feedback: formFeedback.value ?? '' }, () => {
        onCancel?.()
        form.reset()
      })
    }
    else {
      onCancel?.()
      form.reset()
    }
  }

  return {
    form,
    isFormValid,
    isSubmitting,
    hasErrors,
    isDirty,
    handleCancel
  }
}
