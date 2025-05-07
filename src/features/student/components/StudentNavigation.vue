<script setup lang="ts">
import { AvNavigation, RI_ICONS } from '@/ui'
import { useId } from 'vue'
import { STUDENT_EDUCATION_ACTIVITIES_ROUTE, STUDENT_EDUCATION_SKILLS_ROUTE, STUDENT_HOME_ROUTE, STUDENT_PROJECT_EXPERIENCES_ROUTE, STUDENT_PROJECT_SKILLS_ROUTE, STUDENT_PROJECT_TRAJECTORIES_ROUTE, STUDENT_TOOLS_PAGES_ROUTE, STUDENT_TOOLS_RESUMES_ROUTE, STUDENT_TOOLS_TRACKS_ROUTE } from '../routes'

const route = useRoute()

const navItems = [
  {
    id: useId(),
    to: { name: STUDENT_HOME_ROUTE },
    text: 'ACCUEIL',
    icon: RI_ICONS.HOME,
  },
  {
    title: 'RÉUSSIR MA FORMATION',
    get active () {
      return route.name === STUDENT_EDUCATION_SKILLS_ROUTE || route.name === STUDENT_EDUCATION_ACTIVITIES_ROUTE
    },
    links: [
      { to: { name: STUDENT_EDUCATION_SKILLS_ROUTE }, text: 'Mes compétences', icon: RI_ICONS.USER_STAR },
      { to: { name: STUDENT_EDUCATION_ACTIVITIES_ROUTE }, text: 'Mes mises en situation', icon: RI_ICONS.GRADUATION_CAP },
    ],
  },
  {
    title: 'CONSTRUIRE MON PROJET DE VIE',
    get active () {
      return route.name === STUDENT_PROJECT_SKILLS_ROUTE
        || route.name === STUDENT_PROJECT_EXPERIENCES_ROUTE
        || route.name === STUDENT_PROJECT_TRAJECTORIES_ROUTE
    },
    links: [
      {
        to: { name: STUDENT_PROJECT_SKILLS_ROUTE },
        text: 'Toutes mes compétences',
        icon: RI_ICONS.USER_SETTINGS,
      },
      {
        to: { name: STUDENT_PROJECT_EXPERIENCES_ROUTE },
        text: 'Mon parcours',
        icon: RI_ICONS.BRIEFCASE,
      },
      { to: { name: STUDENT_PROJECT_TRAJECTORIES_ROUTE }, text: 'Bâtir mon projet', icon: RI_ICONS.SHARE },
    ],
  },
  {
    title: 'MES OUTILS',
    get active () {
      return route.name === STUDENT_TOOLS_TRACKS_ROUTE
        || route.name === STUDENT_TOOLS_PAGES_ROUTE
        || route.name === STUDENT_TOOLS_RESUMES_ROUTE
    },
    links: [
      { to: { name: STUDENT_TOOLS_TRACKS_ROUTE }, text: 'Mes traces', icon: RI_ICONS.ATTACHMENT },
      { to: { name: STUDENT_TOOLS_PAGES_ROUTE }, text: 'Mes pages libres', icon: RI_ICONS.FILE_COPY },
      { to: { name: STUDENT_TOOLS_RESUMES_ROUTE }, text: 'Mes CV', icon: RI_ICONS.FILE_USER },
    ],
  },
]
</script>

<template>
  <AvNavigation :nav-items="navItems" />
</template>

<style lang="scss" scoped>
</style>
