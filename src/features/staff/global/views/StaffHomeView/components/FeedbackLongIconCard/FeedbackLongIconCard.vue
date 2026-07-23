<script lang="ts" setup>
import type { FeedbackStaffListItemDTO } from '@/api/avenir-esr'
import type { AvLocale } from '@/types'
import LongIconCard from '@/common/components/cards/LongIconCard/LongIconCard.vue'
import { ICONS, ROUTES } from '@/common/constants'
import { formatDateLocalized } from '@/common/utils'
import { useI18n } from 'vue-i18n'

export interface FeedbackLongIconCardProps {
  feedback: FeedbackStaffListItemDTO
}

const { feedback } = defineProps<FeedbackLongIconCardProps>()

const { t, locale } = useI18n()

const title = computed(() => `${t('global.activities.activity')} "${feedback.activity?.title}"`)
const date = computed(() => feedback.createdAt
  ? ` - ${formatDateLocalized(feedback.createdAt, locale.value as AvLocale, true)}`
  : '')
const description = computed(() => `${feedback.student?.firstName} ${feedback.student?.lastName}${date.value}`)
</script>

<template>
  <LongIconCard
    :title="title"
    :icon="{ name: ICONS.FEEDBACK, color: 'var(--dark-background-primary3)' }"
    icon-background-color="var(--light-background-primary3)"
    :to="{ name: ROUTES.STAFF.ACTIVITY_FEEDBACK.name, params: { feedbackId: feedback.id } }"
  >
    <span
      class="caption-light av-text-text2"
      data-testid="feedback-description"
    >
      {{ description }}
    </span>
  </LongIconCard>
</template>
