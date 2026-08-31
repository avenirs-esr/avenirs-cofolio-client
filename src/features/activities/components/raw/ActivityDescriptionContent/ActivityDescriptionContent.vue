<script setup lang="ts">
import DOMPurify from 'dompurify'

export interface ActivityDescriptionContentProps {
  description?: string
}
const { description } = defineProps<ActivityDescriptionContentProps>()
const sanitizedDescription = computed(() =>
  DOMPurify.sanitize(description ?? '')
)
</script>

<template>
  <div
    data-testid="activity-description"
    data-user-content
    v-html="sanitizedDescription"
  />
</template>
