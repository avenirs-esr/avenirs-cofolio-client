<script setup lang="ts">
import {
  StudentDeliverablesWidget,
  StudentEventsWidget,
  StudentOverviewWidget,
  StudentPagesWidget,
  StudentResumesWidget,
  StudentSkillsWidget,
  StudentTracesWidget
} from '@/features/student/components'
</script>

<template>
  <div class="layout-home">
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
@use "@avenirs-esr/avenirs-dsav/src/styles/breakpoints" as *;

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

  @include respond-below("md") {
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
