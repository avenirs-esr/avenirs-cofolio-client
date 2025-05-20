<script setup lang="ts">
import type { EventDTO, PageDTO } from '@/types'
import { StudentEventsWidget, StudentOverviewWidget, StudentPagesWidget, StudentResumesWidget, StudentSkillsWidget } from '@/features/student/components'
import { useStudentSummaryQuery } from '@/features/student/queries'

const { data: studentSummary } = useStudentSummaryQuery()

const mockedEvents = [
  {
    id: 'event1',
    name: 'Forum de l’écologie et la chimie',
    startDate: '2025-05-19T08:00',
    endDate: '2025-05-19T18:00',
    location: 'Paris'
  },
  {
    id: 'event2',
    name: 'Super forum de la mécanique quantique',
    startDate: '2025-06-25T08:30',
    endDate: '2025-06-25T17:30',
    location: 'Toulouse'
  },
  {
    id: 'event3',
    name: 'Le café des associations',
    startDate: '2025-07-03T09:00',
    endDate: '2025-07-03T17:00',
    location: 'Bordeaux'
  },
  {
    id: 'event4',
    name: 'Assemblée générale ESUP',
    startDate: '2025-08-08T09:30',
    endDate: '2025-08-08T12:15',
    location: 'Brest'
  },
] as Array<EventDTO>

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
        <StudentEventsWidget :events="mockedEvents" />
        <StudentResumesWidget />
        <StudentPagesWidget :pages="mockedPages" />
      </div>
      <div class="student-home-right-container fr-col-8">
        <StudentSkillsWidget />
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
