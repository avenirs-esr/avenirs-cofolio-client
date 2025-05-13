<script setup lang="ts">
import type { SkillDTO } from '@/types'
import { StudentCoursesSkillsWidget } from '../components'

const mockedSkills: Array<SkillDTO> = [
  {
    id: 'skill1',
    name: 'Prévenir la pollution à la source',
    trackCount: 1,
    activityCount: 4,
    levels: [{ id: 'Niv1', name: 'Niv.1', status: 'VALIDATED' }, { id: 'Niv2', name: 'Niv.2', status: 'TO_EVALUATE' }]
  },
  {
    id: 'skill2',
    name: 'Mettre en place des filières d’économies circulaires',
    trackCount: 1,
    activityCount: 4,
    levels: [{ id: 'Niv1', name: 'Niv.1', status: 'VALIDATED' }, { id: 'Niv2', name: 'Niv.2', status: 'TO_EVALUATE' }]
  },
  {
    id: 'skill3',
    name: 'Évaluer l’impact environnemental et économique',
    trackCount: 1,
    activityCount: 4,
    levels: [{ id: 'Niv1', name: 'Niv.1', status: 'NOT_VALIDATED' }, { id: 'Niv2', name: 'Niv.2', status: 'UNDER_REVIEW' }]
  },
  {
    id: 'skill4',
    name: 'Concevoir des synthèses chimiques durables',
    trackCount: 1,
    activityCount: 4,
    levels: [{ id: 'Niv2', name: 'Niv.2', status: 'VALIDATED' }]
  },
  {
    id: 'skill5',
    name: 'BIS Prévenir la pollution à la source',
    trackCount: 1,
    activityCount: 4,
    levels: [{ id: 'Niv1', name: 'Niv.1', status: 'VALIDATED' }, { id: 'Niv2', name: 'Niv.2', status: 'TO_EVALUATE' }]
  },
  {
    id: 'skill6',
    name: 'BIS Mettre en place des filières d’économies circulaires',
    trackCount: 1,
    activityCount: 4,
    levels: [{ id: 'Niv1', name: 'Niv.1', status: 'VALIDATED' }, { id: 'Niv2', name: 'Niv.2', status: 'TO_EVALUATE' }]
  },
  {
    id: 'skill7',
    name: 'BIS Évaluer l’impact environnemental et économique',
    trackCount: 1,
    activityCount: 4,
    levels: [{ id: 'Niv1', name: 'Niv.1', status: 'NOT_VALIDATED' }, { id: 'Niv2', name: 'Niv.2', status: 'UNDER_REVIEW' }]
  },
  {
    id: 'skill8',
    name: 'BIS Concevoir des synthèses chimiques durables',
    trackCount: 1,
    activityCount: 4,
    levels: [{ id: 'Niv2', name: 'Niv.2', status: 'VALIDATED' }]
  },
]

const mockedCourses = [
  { id: 'course1', name: 'Master Chimie Verte et Éco-innovations', skills: mockedSkills },
]
</script>

<template>
  <h1>Student feature home page</h1>
  <StudentCoursesSkillsWidget :courses="mockedCourses" />
</template>
