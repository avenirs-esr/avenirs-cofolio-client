<script setup lang="ts">
import type { PageDTO } from '@/types'
import {
  StudentDeliverablesWidget,
  StudentEventsWidget,
  StudentOverviewWidget,
  StudentPagesWidget,
  StudentResumesWidget,
  StudentSkillsWidget,
  StudentTracksWidget
} from '@/features/student/components'
import { useStudentSummaryQuery } from '@/features/student/queries'

const { data: studentSummary } = useStudentSummaryQuery()

const mockedPages = [
  { id: 'page1', name: 'analyse-ams-13-02-2024', updatedAt: '2025-02-22' },
  { id: 'page2', name: 'projetdevie-trajectoires', updatedAt: '2024-12-20' },
  { id: 'page3', name: 'Recherche-stage-SAP-3-avril202', updatedAt: '2024-10-04' },
  { id: 'page4', name: 'analyse-projet-de-vie', updatedAt: '2024-09-08' },
] as Array<PageDTO>
</script>

<template>
  <div class="fr-container--fluid">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="student-home-left-container fr-col-4">
        <StudentOverviewWidget
          v-if="studentSummary"
          :student-summary="studentSummary"
        />
        <StudentEventsWidget />
        <StudentResumesWidget />
        <StudentPagesWidget :pages="mockedPages" />
      </div>
      <div class="student-home-right-container fr-col-8">
        <StudentSkillsWidget />
        <StudentDeliverablesWidget />
        <StudentTracksWidget />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.student-home-left-container,
.student-home-right-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
</style>
