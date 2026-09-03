<script lang="ts" setup>
import type { ActivityItemNavigationDTO } from '@/api/avenir-esr'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import FeedbackActivityFilterSelect from '@/features/staff/feedbacks/views/FeedbacksView/components/interaction/inputs/FeedbackActivityFilterSelect/FeedbackActivityFilterSelect.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (event: 'selectedActivityChange', activity?: ActivityItemNavigationDTO): void
}>()

const { t } = useI18n()
</script>

<template>
  <IconTitleCardContainer
    :title="t('staff.feedbacks.views.FeedbacksView.FeedbacksFiltersCard.title')"
    :title-icon="MDI_ICONS.FILTER_OUTLINE"
    data-testid="feedbacks-filters-card"
  >
    <FeedbackActivityFilterSelect @change="emit('selectedActivityChange', $event)" />
  </IconTitleCardContainer>
</template>
