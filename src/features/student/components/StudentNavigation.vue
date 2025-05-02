<script setup lang="ts">
import { AvNavigation, RI_ICONS } from '@/ui'
import { useId } from 'vue'
import { STUDENT_EDUCATION_PRACTICE_ROUTE, STUDENT_EDUCATION_SKILLS_ROUTE, STUDENT_HOME_ROUTE, STUDENT_PROJECT_EXPERIENCES_ROUTE, STUDENT_PROJECT_SKILLS_ROUTE, STUDENT_PROJECT_TRAJECTORIES_ROUTE, STUDENT_TOOLS_PAGES_ROUTE, STUDENT_TOOLS_RESUMES_ROUTE, STUDENT_TOOLS_TRACKS_ROUTE } from '../routes'

const route = useRoute()

const navItems = [
  {
    id: useId(),
    to: { name: STUDENT_HOME_ROUTE },
    text: 'ACCUEIL',
    icon: { name: RI_ICONS.HOME, scale: 1.5 }, // accepte uniqement les icones RI
  },
  {
    title: 'RÉUSSIR MA FORMATION',
    icon: { name: RI_ICONS.AWARD, scale: 1.5 }, // TODO: non supporté pour le moment, éventuellement par le fork ?
    get active () {
      return route.name === STUDENT_EDUCATION_SKILLS_ROUTE || route.name === STUDENT_EDUCATION_PRACTICE_ROUTE
    },
    links: [
      { to: { name: STUDENT_EDUCATION_SKILLS_ROUTE }, text: 'Mes compétences', icon: { name: RI_ICONS.USER_STAR, scale: 1.5 } },
      { to: { name: STUDENT_EDUCATION_PRACTICE_ROUTE }, text: 'Mes mises en situation', icon: { name: RI_ICONS.ATTACHEMENT, scale: 1.5 } },
    ],
  },
  {
    title: 'CONSTRUIRE MON PROJET DE VIE',
    icon: { name: RI_ICONS.SEEDLING, scale: 1.5 },
    get active () {
      return route.name === STUDENT_PROJECT_SKILLS_ROUTE
        || route.name === STUDENT_PROJECT_EXPERIENCES_ROUTE
        || route.name === STUDENT_PROJECT_TRAJECTORIES_ROUTE
    },
    links: [
      {
        to: { name: STUDENT_PROJECT_SKILLS_ROUTE },
        text: 'Mes compétences complémentaires',
        icon: { name: RI_ICONS.USER_SETTINGS, scale: 1.5 },
      },
      {
        to: { name: STUDENT_PROJECT_EXPERIENCES_ROUTE },
        text: 'Mes expériences professionnelles',
        icon: { name: RI_ICONS.ATTACHEMENT, scale: 1.5 },
      },
      { to: { name: STUDENT_PROJECT_TRAJECTORIES_ROUTE }, text: 'Mes trajectoires', icon: { name: RI_ICONS.SHARE, scale: 1.5 } },
    ],
  },
  {
    title: 'MES OUTILS',
    icon: { name: RI_ICONS.SETTINGS, scale: 1.5 },
    get active () {
      return route.name === STUDENT_TOOLS_TRACKS_ROUTE
        || route.name === STUDENT_TOOLS_PAGES_ROUTE
        || route.name === STUDENT_TOOLS_RESUMES_ROUTE
    },
    links: [
      { to: { name: STUDENT_TOOLS_TRACKS_ROUTE }, text: 'Mes traces', icon: { name: RI_ICONS.ATTACHEMENT, scale: 1.5 } },
      { to: { name: STUDENT_TOOLS_PAGES_ROUTE }, text: 'Mes pages libres', icon: { name: RI_ICONS.DRAFT, scale: 1.5 } },
      { to: { name: STUDENT_TOOLS_RESUMES_ROUTE }, text: 'Mes CV', icon: { name: RI_ICONS.FILE_TEXT, scale: 1.5 } },
    ],
  },
]
</script>

<template>
  <AvNavigation :nav-items="navItems" />
</template>

<style lang="scss" scoped></style>
