<script setup lang="ts">
export interface ActivityRecommendedCompletionContextsListProps {
  recommendedCompletionContexts?: string
}

const { recommendedCompletionContexts }
  = defineProps<ActivityRecommendedCompletionContextsListProps>()
const recommendedCompletionContextsList = computed(() => {
  if (!recommendedCompletionContexts) {
    return []
  }
  return recommendedCompletionContexts
    .split('\n')
    .map(line => line.trim())
    .map(line => line.replace(/^-+\s*/, ''))
})
</script>

<template>
  <ul
    class="s2-regular execution-list"
    data-testid="activity-recommended-completion-contexts-list"
  >
    <li
      v-for="(item, index) in recommendedCompletionContextsList"
      :key="index"
    >
      {{ item }}
    </li>
  </ul>
</template>

<style scoped lang="scss">
.execution-list {
  color: var(--dark-background-primary1);
}
</style>
