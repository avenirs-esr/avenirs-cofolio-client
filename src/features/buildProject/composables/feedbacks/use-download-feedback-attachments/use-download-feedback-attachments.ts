import type { BaseApiException } from '@/common/exceptions'
import { type FeedbackOverviewDTO, useDownloadFeedbackAttachment } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { downloadBlob } from '@/common/utils/download/download'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export function useDownloadFeedbackAttachments (feedback: FeedbackOverviewDTO) {
  const { addErrorMessage } = useToasterStore()
  const { getErrorMessage } = useApiErrors()
  const { t } = useI18n()

  const feedbackAttachments = computed(() => feedback.attachments ?? [])

  const { mutateAsync: downloadAttachment } = useDownloadFeedbackAttachment({
    mutation: {
      onError: (error: BaseApiException) => {
        addErrorMessage({
          title: t('global.error.download'),
          description: getErrorMessage(error),
        })
      }
    }
  })

  async function downloadFeedbackAttachment (fileId: string, fileName: string) {
    try {
      const data = await downloadAttachment({ feedbackId: feedback.id, attachmentId: fileId })
      downloadBlob(data, fileName)
    }
    catch (error) {
      void error
      return undefined
    }
  }

  async function downloadAllFeedbackAttachments () {
    await Promise.allSettled(
      feedbackAttachments.value.map(file => downloadFeedbackAttachment(file.id, file.fileName))
    )
  }

  return {
    feedbackAttachments,
    downloadFeedbackAttachment,
    downloadAllFeedbackAttachments,
  }
}
