<script lang="ts" setup>
import type { FeedbackOverviewDTO } from '@/api/avenir-esr'
import Card from '@/common/components/cards/Card/Card.vue'
import { ICONS } from '@/common/constants'
import FeedbackAttachmentsPillList from '@/features/student/buildProject/components/lists/FeedbackAttachmentsPillList/FeedbackAttachmentsPillList.vue'
import { useDownloadFeedbackAttachments } from '@/features/student/buildProject/composables/feedbacks/use-download-feedback-attachments/use-download-feedback-attachments'
import { AvButton, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { format } from 'date-fns'
import { useI18n } from 'vue-i18n'

export interface FeedbackCardProps {
  feedback: FeedbackOverviewDTO
}

const { feedback } = defineProps<FeedbackCardProps>()

const { t } = useI18n()

const i18nKey = 'student.buildProject.activities.views.ProjectActivityDetailedView.FeedbackCard'

const titleLabel = computed(() => `${t(`${i18nKey}.receivedAt`)} ${format(new Date(feedback.createdAt), 'dd/MM/yyyy')}`)

const staffLabel = computed(() =>
  `${feedback.staff?.firstName?.[0]}. ${feedback.staff?.lastName} (${t(`${i18nKey}.staffRole`)})`
)

const { downloadAllFeedbackAttachments } = useDownloadFeedbackAttachments(feedback)
</script>

<template>
  <Card
    background-color="var(--surface-background)"
    title-background="var(--surface-background)"
    border-color="transparent"
    data-testid="feedback-card"
    :data-feedback-id="feedback.id"
  >
    <template #title>
      <AvIconText
        typography-class="n6"
        :icon="ICONS.FEEDBACK"
        icon-color="var(--text1)"
        :text="titleLabel"
        text-color="var(--text1)"
        gap="var(--spacing-sm)"
        data-testid="feedback-card-title"
      />
    </template>

    <template #body>
      <div class="av-col av-gap-xs">
        <span
          class="b2-regular av-text-text2"
          data-testid="feedback-card-staff"
        >
          {{ staffLabel }}
        </span>

        <span
          v-if="feedback.feedback"
          class="b2-light av-text-text1"
          data-testid="feedback-card-content"
        >
          {{ feedback.feedback }}
        </span>
        <div class="av-col av-gap-sm">
          <div
            v-if="(feedback.attachments?.length ?? 0) > 1"
            class="av-row av-justify-end"
          >
            <AvButton
              :label="t('student.buildProject.activities.views.ProjectActivityDetailedView.FeedbackCard.downloadAllAttachments')"
              :icon="MDI_ICONS.DOWNLOAD_OUTLINE"
              data-testid="download-all-attachments"
              @click="downloadAllFeedbackAttachments"
            />
          </div>
          <FeedbackAttachmentsPillList :feedback="feedback" />
        </div>
      </div>
    </template>
  </Card>
</template>
