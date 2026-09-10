<script setup lang="ts">
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import DOMPurify from 'dompurify'
import { useI18n } from 'vue-i18n'

export interface FeedbackActivityConsignCardProps {
  description?: string
}

const { description } = defineProps<FeedbackActivityConsignCardProps>()

const { t } = useI18n()

const content = computed(() => description ? DOMPurify.sanitize(description) : '')
</script>

<template>
  <IconTitleCardContainer
    v-if="!!content"
    :title-icon="MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE"
    :title="t('staff.feedbacks.views.FeedbacksView.FeedbackActivityConsignCard.title')"
    collapsible
    :collapsed="true"
    data-testid="feedback-activity-consign-card"
  >
    <div
      data-user-content
      data-testid="activity-consign-card-content"
      v-html="content"
    />
  </IconTitleCardContainer>
</template>
