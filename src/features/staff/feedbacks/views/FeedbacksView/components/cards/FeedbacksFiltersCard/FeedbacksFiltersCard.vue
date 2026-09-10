<script lang="ts" setup>
import type { ActivityFeedbacksPreviewDTO } from '@/api/avenir-esr'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import FeedbackActivityFilterSelect from '@/features/staff/feedbacks/views/FeedbacksView/components/interaction/inputs/FeedbackActivityFilterSelect/FeedbackActivityFilterSelect.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbacksFiltersCardProps {
  defaultActivityId?: string
}

const { defaultActivityId } = defineProps<FeedbacksFiltersCardProps>()

const emit = defineEmits<{
  (event: 'selectedActivityChange', activity?: ActivityFeedbacksPreviewDTO): void
}>()

const { t } = useI18n()
</script>

<template>
  <IconTitleCardContainer
    :title="t('staff.feedbacks.views.FeedbacksView.FeedbacksFiltersCard.title')"
    :title-icon="MDI_ICONS.FILTER_OUTLINE"
    data-testid="feedbacks-filters-card"
  >
    <FeedbackActivityFilterSelect
      :default-activity-id="defaultActivityId"
      @change="emit('selectedActivityChange', $event)"
    />
  </IconTitleCardContainer>
</template>
