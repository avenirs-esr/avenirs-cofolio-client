<script setup lang="ts">
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import DOMPurify from 'dompurify'
import { useI18n } from 'vue-i18n'

export interface ActivityConsignCardProps {
  description?: string
}

const { description } = defineProps<ActivityConsignCardProps>()

const { t } = useI18n()

const sanitizedContent = computed(() =>
  DOMPurify.sanitize(description ?? '')
)
</script>

<template>
  <IconTitleCardContainer
    :title-icon="MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE"
    :title="t('staff.feedbacks.cards.ActivityConsignCard.title')"
    collapsible
    :collapsed="true"
    data-testid="activity-consign-card"
  >
    <div
      data-user-content
      data-testid="activity-consign-card-content"
      v-html="sanitizedContent"
    />
  </IconTitleCardContainer>
</template>
