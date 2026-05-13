<script setup lang="ts">
export interface ActivityExecutionPeriodListProps {
  executionPeriodInfo?: string
}

const { executionPeriodInfo }
  = defineProps<ActivityExecutionPeriodListProps>()
const executionPeriodList = computed(() => {
  if (!executionPeriodInfo) {
    return []
  }
  return executionPeriodInfo
    .split('\n')
    .map(line => line.trim())
    .map(line => line.replace(/^-+\s*/, ''))
})
</script>

<template>
  <ul
    class="s2-regular execution-list"
    data-testid="activity-execution-period"
  >
    <li
      v-for="(item, index) in executionPeriodList"
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
