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
  <div class="fr-container--fluid">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="student-home-left-container fr-col-4">
        <StudentOverviewWidget />
        <StudentEventsWidget />
        <StudentResumesWidget />
        <StudentPagesWidget />
      </div>
      <div class="student-home-right-container fr-col-8">
        <StudentSkillsWidget />
        <StudentDeliverablesWidget />
        <StudentTracesWidget />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.student-home-left-container,
.student-home-right-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}
</style>
