<script setup lang="ts">
import type { ResumeDTO } from '@/types'
import { parseDateFR } from '@/common/utils'
import { StudentOverviewWidget, StudentResumesWidget, StudentSkillsWidget } from '@/features/student/components'
import { useStudentSummaryQuery } from '@/features/student/queries'

const { data: studentSummary } = useStudentSummaryQuery()

const mockedResumes = [
  { id: 'resume1', name: 'cv-version1-05-2024', lastUpdated: parseDateFR('19/05/2025') },
  { id: 'resume2', name: 'cv-version1-04-2024', lastUpdated: parseDateFR('25/04/2025') },
  { id: 'resume3', name: 'cv-version1-03-2024', lastUpdated: parseDateFR('3/03/2025') },
  { id: 'resume4', name: 'cv-version1-02-2024', lastUpdated: parseDateFR('8/02/2025') },
] as Array<ResumeDTO>
</script>

<template>
  <div class="fr-container--fluid">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="student-home-left-container fr-col-4">
        <StudentOverviewWidget
          v-if="studentSummary"
          :student-summary="studentSummary"
        />
        <StudentResumesWidget :resumes="mockedResumes" />
      </div>
      <div class="fr-col-8">
        <StudentSkillsWidget />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.student-home-left-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
</style>
