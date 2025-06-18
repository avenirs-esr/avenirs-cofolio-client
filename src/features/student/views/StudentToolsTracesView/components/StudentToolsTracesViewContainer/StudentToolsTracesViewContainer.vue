<script lang="ts" setup>
// import type { TraceViewDTO } from '@/api/avenir-esr'
// import { useI18n } from 'vue-i18n'

// const { traces } = defineProps<{ traces: TraceViewDTO[] }>()

// const { t } = useI18n()
</script>

<template>
  <div class="student-tools-traces-view-container">
    <div class="top-pagination-container" />
  </div>
</template>

<style lang="scss" scoped>
.student-tools-traces-view-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
}

.top-pagination-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
