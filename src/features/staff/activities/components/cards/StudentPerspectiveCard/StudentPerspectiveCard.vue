<script setup lang="ts">
import Card from '@/common/components/cards/Card/Card.vue'
import { ICONS } from '@/common/constants'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'
import DOMPurify from 'dompurify'
import { useI18n } from 'vue-i18n'

export interface StudentPerspectiveCardProps {
  perspective?: string
}

const { perspective } = defineProps<StudentPerspectiveCardProps>()

const { t } = useI18n()

const sanitizedContent = computed(() =>
  DOMPurify.sanitize(perspective ?? '')
)
</script>

<template>
  <Card
    background-color="var(--card2)"
    title-background="var(--card2)"
    border-color="var(--other-border-skill-card)"
    collapsible
    :collapsed="false"
    data-testid="student-perspective-card"
  >
    <template #title>
      <AvIconText
        typography-class="n4"
        :icon="ICONS.ACTIVITY_PERSPECTIVE"
        icon-color="var(--dark-background-primary1)"
        :text="t('staff.activities.feedbacks.cards.StudentPerspectiveCard.title')"
        text-color="var(--text1)"
        gap="var(--spacing-sm)"
        data-testid="student-perspective-card-title"
      />
    </template>

    <div
      data-user-content
      data-testid="student-perspective-card-content"
      v-html="sanitizedContent"
    />
  </Card>
</template>
