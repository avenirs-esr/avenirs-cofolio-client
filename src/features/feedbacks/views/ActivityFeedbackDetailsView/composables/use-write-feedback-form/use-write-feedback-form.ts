import type { BaseApiException } from '@/common/exceptions'
import type { WriteFeedbackFormApi, WriteFeedbackFormData } from '@/features/feedbacks/types/forms.types'
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
import { useQueueAutoSave } from '@/common/composables/use-queue-auto-save/use-queue-auto-save'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { dtoToFile, isFile } from '@/common/utils/file/file'
import { FEEDBACK_AUTO_SAVE_DEBOUNCE } from '@/features/feedbacks/config'
import { useWriteFeedbackFormValidators } from '@/features/feedbacks/views/ActivityFeedbackDetailsView/composables/use-write-feedback-form-validators/use-write-feedback-form-validators'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { type MaybeRef, toValue } from 'vue'
import { useI18n } from 'vue-i18n'

interface UseWriteFeedbackFormParams {
  feedback: MaybeRef<FeedbackDetailsDTO>
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
  const { validateFeedback, validateAttachments } = useWriteFeedbackFormValidators()

  const { mutateAsync: updateFeedback, isPending } = useUpdateFeedback({
    mutation: {
      onError: (error: BaseApiException) => {
        addErrorMessage({
          title: t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.errors.saveFeedback'),
          description: getErrorMessage(error)
        })
      }
    }
  })
  const { mutateAsync: uploadAttachment, isPending: isUploadingAttachment } = useUploadFeedbackAttachment({
    mutation: {
      onError: (error: BaseApiException) => {
        addErrorMessage({
          title: t('global.error.fileUpload'),
          description: getErrorMessage(error)
        })
      }
    }
  })
  const { mutateAsync: deleteAttachment, isPending: isDeletingAttachment } = useDeleteFeedbackAttachment({
    mutation: {
      onError: (error: BaseApiException) => {
        addErrorMessage({
          title: t('global.error.fileUpload'),
          description: getErrorMessage(error)
        })
      }
    }
  })

  const {
    queueAutoSave,
    cancelAutoSave,
    pendingAutoSaveData
  } = useQueueAutoSave<UpdateFeedbackRequest>(save, FEEDBACK_AUTO_SAVE_DEBOUNCE)

  const feedbackData = computed(() => toValue(feedback))
  const liveFormData = computed<WriteFeedbackFormData>(() => ({
    feedback: feedbackData.value.feedback ?? '',
    attachments: feedbackData.value.attachments ?? []
  }))
  const originalFormData = ref<WriteFeedbackFormData>({ ...liveFormData.value })

  const form = useForm({
    defaultValues: originalFormData.value,
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
      cancelAutoSave()
      pendingAutoSaveData.value = {}

      await save({ feedback: value.feedback })

      originalFormData.value = { ...liveFormData.value }
      form.reset(originalFormData.value)
    }
  })

  const formState = form.useStore(state => state)
  const isFormValid = computed(() => formState.value.isValid && !formState.value.isValidating)
  const isDirty = computed(() => formState.value.isDirty)

  async function saveFeedback (data: UpdateFeedbackRequest) {
    await updateFeedback({
      feedbackId: feedbackData.value.id,
      data
    })
  }

  async function saveAttachments (toUpload: File[], toDelete: FileDTO[] = []) {
    await Promise.all([
      ...toUpload.map(file => uploadAttachment({
        feedbackId: feedbackData.value.id,
        data: { file }
      })),
      ...toDelete.map(file => deleteAttachment({
        feedbackId: feedbackData.value.id,
        attachmentId: file.id
      }))
    ])
  }

  async function save (data?: UpdateFeedbackRequest) {
    const promises: Promise<void>[] = []
    const attachments = form.getFieldValue('attachments')

    const newAttachments = attachments.filter(isFile)
    const removedAttachments = originalFormData.value.attachments.filter(original => !isFile(original) && !attachments.some(current => !isFile(current) && current.id === original.id)) as FileDTO[]

    if (newAttachments.length > 0 || removedAttachments.length > 0) {
      promises.push(saveAttachments(newAttachments, removedAttachments))
    }

    if (data) {
      promises.push(saveFeedback(data))
    }

    await withTaskLoading(() => Promise.allSettled(promises))
    await withTaskLoading(() => invalidateGetFeedbackDetails(queryClient, EUserCategory.STAFF, feedbackData.value.id))

    onFeedbackSaved?.()
  }

  async function handleCancel () {
    cancelAutoSave()
    pendingAutoSaveData.value = {}

    if (isDirty.value) {
      const promises: Promise<void>[] = [
        saveFeedback({ feedback: originalFormData.value.feedback })
      ]

      const originalAttachments = originalFormData.value.attachments as FileDTO[]
      const liveAttachments = (feedbackData.value.attachments ?? []) as FileDTO[]

      const toReupload = originalAttachments.filter(original => !liveAttachments.some(live => live.id === original.id))
      const toDiscard = liveAttachments.filter(live => !originalAttachments.some(original => original.id === live.id))

      if (toReupload.length > 0 || toDiscard.length > 0) {
        await withTaskLoading(() => saveAttachments(toReupload.map(dtoToFile), toDiscard))
      }

      await withTaskLoading(() => Promise.allSettled(promises))
      await withTaskLoading(() => invalidateGetFeedbackDetails(queryClient, EUserCategory.STAFF, feedbackData.value.id))
    }

    form.reset(originalFormData.value)
    onCancel?.()
  }

  const hasErrors = hasFieldErrors(form, ['feedback', 'attachments'])

  const isSubmitting = computed(
    () => isPending.value || isUploadingAttachment.value || isDeletingAttachment.value || isLoading.value
  )

  watch(liveFormData, (data) => {
    if (!isDirty.value) {
      originalFormData.value = { ...data }
      form.reset(originalFormData.value)
    }
  })

  return {
    form,
    isFormValid,
    isSubmitting,
    hasErrors,
    isDirty,
    queueAutoSave,
    handleCancel
  }
}
