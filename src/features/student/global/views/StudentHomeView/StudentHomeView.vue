<script setup lang="ts">
import StudentDeliverablesWidget from '@/features/student/global/views/StudentHomeView/components/StudentDeliverablesWidget/StudentDeliverablesWidget.vue'
import StudentEventsWidget from '@/features/student/global/views/StudentHomeView/components/StudentEventsWidget/StudentEventsWidget.vue'
import StudentPagesWidget from '@/features/student/global/views/StudentHomeView/components/StudentPagesWidget/StudentPagesWidget.vue'
import StudentResumesWidget from '@/features/student/global/views/StudentHomeView/components/StudentResumesWidget/StudentResumesWidget.vue'
import { StudentSkillsWidget } from '@/features/student/skills'
import { StudentTracesWidget } from '@/features/student/traces'
import { StudentOverviewWidget } from '@/features/student/user'
import { useAvBreakpoints, useGlobalBackgroundColor } from '@avenirs-esr/avenirs-dsav'

useGlobalBackgroundColor('var(--surface-background)')
const { isMobile } = useAvBreakpoints()
</script>

<template>
  <div
    class="layout-home"
    :class="{
      'layout-home--mobile': isMobile,
    }"
  >
    <div class="layout-home__sidebar">
      <StudentOverviewWidget />
      <StudentEventsWidget class="demo-display-none" />
      <StudentResumesWidget class="demo-display-none" />
      <StudentPagesWidget class="demo-display-none" />
    </div>
    <div class="layout-home__main">
      <StudentSkillsWidget />
      <StudentDeliverablesWidget class="demo-display-none" />
      <StudentTracesWidget />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-home {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;

  &__sidebar {
    display: flex;
    flex-direction: column;
    flex: 0 1 400px;
    min-width: 300px;
    gap: var(--spacing-xl);
  }

  &__main {
    display: flex;
    flex-direction: column;
    flex: 1 1 300px;
    min-width: 300px;
    gap: var(--spacing-xl);
  }

  &--mobile {
    flex-wrap: wrap;
    justify-content: center;

    &__sidebar,
    &__main {
      flex: 1 1 100%;
      max-width: 100%;
    }
  }
}
</style>
