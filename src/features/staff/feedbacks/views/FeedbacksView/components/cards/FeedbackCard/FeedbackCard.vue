<script lang="ts" setup>
import type { FeedbackStaffListItemDTO } from '@/api/avenir-esr'
import Card from '@/common/components/cards/Card/Card.vue'
import { useDateUtils } from '@/common/composables'
import FeedbackIterationBadge from '@/features/staff/feedbacks/components/badges/FeedbackIterationBadge/FeedbackIterationBadge.vue'
import FeedbackStatusBadge from '@/features/staff/feedbacks/components/badges/FeedbackStatusBadge/FeedbackStatusBadge.vue'
import { useI18n } from 'vue-i18n'

export interface FeedbackCardProps {
  feedback: FeedbackStaffListItemDTO
}

const { feedback } = defineProps<FeedbackCardProps>()

const { t } = useI18n()
const { formatLastModified, formatTranslatedDateTime } = useDateUtils()

const studentLabel = computed(() => `${feedback.student?.firstName ?? ''} ${feedback.student?.lastName ?? ''}`)
const receivedAtLabel = computed(() => feedback.createdAt ? `${t('staff.feedbacks.cards.receivedAt')} ${formatLastModified(feedback.createdAt)}` : '')
const updatedAtLabel = computed(() => feedback.updatedAt ? `${t('staff.feedbacks.cards.lastSaved')} ${formatTranslatedDateTime(feedback.updatedAt)}` : '')
</script>

<template>
  <Card
    background-color="var(--card)"
    title-background="var(--card)"
    class="feedback-card"
    data-testid="feedback-card"
    :data-feedback-id="feedback.id"
  >
    <div class="av-col av-gap-xs">
      <span class="b1-regular av-text-text1">
        {{ studentLabel }}
      </span>

      <span class="b2-regular av-text-text2">
        {{ feedback.activity?.title }}
      </span>
    </div>

    <div class="details av-col av-gap-sm">
      <span class="b2-regular av-text-text2">
        {{ receivedAtLabel }}
      </span>

      <div class="av-row av-gap-xs av-wrap">
        <FeedbackStatusBadge
          v-if="feedback.status"
          :feedback-status="feedback.status"
        />

        <FeedbackIterationBadge
          :iteration="feedback.iteration ?? 0"
          :max-iterations="feedback.activity?.feedbackAllowedIterations"
        />
      </div>

      <span
        v-if="feedback.updatedAt"
        class="b2-regular av-text-primary"
      >
        {{ updatedAtLabel }}
      </span>
    </div>
  </Card>
</template>
