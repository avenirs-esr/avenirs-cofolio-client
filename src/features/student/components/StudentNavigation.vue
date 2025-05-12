<script setup lang="ts">
import { AvNavigation, MDI_ICONS } from '@/ui'
import { useId } from 'vue'
import { STUDENT_EDUCATION_ACTIVITIES_ROUTE, STUDENT_EDUCATION_SKILLS_ROUTE, STUDENT_HOME_ROUTE, STUDENT_PROJECT_EXPERIENCES_ROUTE, STUDENT_PROJECT_SKILLS_ROUTE, STUDENT_PROJECT_TRAJECTORIES_ROUTE, STUDENT_TOOLS_PAGES_ROUTE, STUDENT_TOOLS_RESUMES_ROUTE, STUDENT_TOOLS_TRACKS_ROUTE } from '../routes'

const route = useRoute()

function isRouteActive (routes: string[]): boolean {
  return routes.includes(route.name as string)
}

const navItems = [
  {
    id: useId(),
    to: { name: STUDENT_HOME_ROUTE },
    text: 'ACCUEIL',
    icon: MDI_ICONS.HOME_VARIANT,
  },
  {
    title: 'RÉUSSIR MA FORMATION',
    get active () {
      return isRouteActive([STUDENT_EDUCATION_SKILLS_ROUTE, STUDENT_EDUCATION_ACTIVITIES_ROUTE])
    },
    links: [
      { to: { name: STUDENT_EDUCATION_SKILLS_ROUTE }, text: 'Mes compétences', icon: MDI_ICONS.STAR_SHOOTING },
      { to: { name: STUDENT_EDUCATION_ACTIVITIES_ROUTE }, text: 'Mes activités de mise en situation', icon: MDI_ICONS.GRADUATION_CAP },
    ],
  },
  {
    title: 'CONSTRUIRE MON PROJET DE VIE',
    get active () {
      return isRouteActive([STUDENT_PROJECT_SKILLS_ROUTE, STUDENT_PROJECT_EXPERIENCES_ROUTE, STUDENT_PROJECT_TRAJECTORIES_ROUTE])
    },
    links: [
      {
        to: { name: STUDENT_PROJECT_SKILLS_ROUTE },
        text: 'Toutes mes compétences',
        icon: MDI_ICONS.STARS,
      },
      {
        to: { name: STUDENT_PROJECT_EXPERIENCES_ROUTE },
        text: 'Mon parcours',
        icon: MDI_ICONS.BRIEFCASE_VARIANT,
      },
      { to: { name: STUDENT_PROJECT_TRAJECTORIES_ROUTE }, text: 'Bâtir mon projet', icon: MDI_ICONS.ARROW_DECISION },
    ],
  },
  {
    title: 'MES OUTILS',
    get active () {
      return isRouteActive([STUDENT_TOOLS_TRACKS_ROUTE, STUDENT_TOOLS_PAGES_ROUTE, STUDENT_TOOLS_RESUMES_ROUTE])
    },
    links: [
      { to: { name: STUDENT_TOOLS_TRACKS_ROUTE }, text: 'Mes traces', icon: MDI_ICONS.ATTACH_FILE },
      { to: { name: STUDENT_TOOLS_PAGES_ROUTE }, text: 'Mes pages libres', icon: MDI_ICONS.POST_IT_NOTES },
      { to: { name: STUDENT_TOOLS_RESUMES_ROUTE }, text: 'Mes CV', icon: MDI_ICONS.FILE_ACCOUNT },
    ],
  },
]
</script>

<template>
  <AvNavigation :nav-items="navItems" />
</template>

<style lang="scss" scoped>
</style>
