<script setup lang="ts">
import type { FeedbackOverviewDTO } from '@/api/avenir-esr'
import { AvFilePill } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useDownloadFeedbackAttachments } from '@/features/student/activities/composables/use-download-feedback-attachments/use-download-feedback-attachments'

export interface FeedbackAttachmentsPillListProps {
  feedback: FeedbackOverviewDTO
}

const { feedback } = defineProps<FeedbackAttachmentsPillListProps>()

const { t } = useI18n()

const { feedbackAttachments, downloadFeedbackAttachment } = useDownloadFeedbackAttachments(feedback)
</script>

<template>
  <div class="av-row av-gap-sm av-align-start">
    <AvFilePill
      v-for="file in feedbackAttachments"
      :key="file.id"
      :name="file.fileName"
      :size="file.fileSize"
      :type="file.fileType"
      :deletable="false"
      :download-prefix-label="t('global.buttons.download')"
      downloadable
      show-details
      @download="() => downloadFeedbackAttachment(file.id, file.fileName)"
    />
  </div>
</template>
