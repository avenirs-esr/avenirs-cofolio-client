import type { BaseApiException } from '@/common/exceptions'
import type { WriteFeedbackFormApi, WriteFeedbackFormData } from '@/features/staff/feedbacks/types/forms.types'
import {
  EUserCategory,
  type FeedbackDetailsDTO,
  type FileDTO,
  invalidateGetFeedbackDetails,
  type UpdateFeedbackRequest,
  useDeleteFeedbackAttachment,
  useUpdateFeedback,
  useUploadFeedbackAttachment
} from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
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
    onSubmit: ({ value }: { value: WriteFeedbackFormData }) => {
      updateFeedback({ feedback: value.feedback }, value.attachments)
    }
  })

  const { mutate: mutateUpdateFeedback, isPending } = useUpdateFeedback()
  const { mutateAsync: mutateUploadAttachment, isPending: isUploadingAttachment } = useUploadFeedbackAttachment()
  const { mutateAsync: mutateDeleteAttachment, isPending: isDeletingAttachment } = useDeleteFeedbackAttachment()

  function resetForm () {
    form.reset({
      feedback: toValue(feedback)?.feedback ?? '',
      attachments: toValue(feedback)?.attachments ?? []
    })
  }

  async function syncAttachments (feedbackId: string, attachments: WriteFeedbackFormData['attachments']) {
    const remoteAttachments = toValue(feedback)?.attachments ?? []
    const addedFiles = attachments.filter((attachment): attachment is File => attachment instanceof File)
    const removedAttachments = remoteAttachments.filter(
      remote => !attachments.some(attachment => !(attachment instanceof File) && attachment.id === remote.id)
    )

    if (!addedFiles.length && !removedAttachments.length) {
      return
    }

    try {
      await Promise.all(
        addedFiles.map(file => mutateUploadAttachment({ feedbackId, data: { file } }))
      )
      await Promise.all(removedAttachments.map(remote => mutateDeleteAttachment({ feedbackId, attachmentId: remote.id })))
    }
    catch (error) {
      addErrorMessage({
        title: t('global.error.fileUpload'),
        description: getErrorMessage(error as BaseApiException)
      })
    }
  }

  function updateFeedback (
    value: UpdateFeedbackRequest,
    attachments: WriteFeedbackFormData['attachments'] = [],
    onSuccess?: () => void
  ) {
    const currentFeedback = toValue(feedback)

    if (!currentFeedback?.id) {
      return
    }

    mutateUpdateFeedback({ feedbackId: currentFeedback.id, data: value }, {
      onSuccess: async () => {
        await syncAttachments(currentFeedback.id, attachments)
        await withTaskLoading(() => invalidateGetFeedbackDetails(queryClient, EUserCategory.STAFF, currentFeedback.id))
        resetForm()
        onFeedbackSaved?.()
        onSuccess?.()
      },
      onError: onSendFeedbackError
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

  function handleCancel () {
    const formState = form.useStore(state => state)
    const formFeedback = formState.value.values.feedback ?? ''
    const formAttachments: (File | FileDTO)[] = formState.value.values.attachments ?? []

    if (formState.value.isDirty && formFeedback.trim() !== '') {
      updateFeedback({ feedback: formFeedback ?? '' }, formAttachments, () => {
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
