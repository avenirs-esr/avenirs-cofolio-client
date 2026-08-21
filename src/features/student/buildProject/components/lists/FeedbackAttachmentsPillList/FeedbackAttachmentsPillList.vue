<script setup lang="ts">
import type { FeedbackOverviewDTO } from '@/api/avenir-esr'
import { useDownloadFeedbackAttachments } from '@/features/student/buildProject/composables/feedbacks/use-download-feedback-attachments/use-download-feedback-attachments'
import { AvFilePill } from '@avenirs-esr/avenirs-dsav'

export interface FeedbackAttachmentsPillListProps {
  feedback: FeedbackOverviewDTO
}

const { feedback } = defineProps<FeedbackAttachmentsPillListProps>()
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
      downloadable
      show-details
      @download="() => downloadFeedbackAttachment(file.id, file.fileName)"
    />
  </div>
</template>
