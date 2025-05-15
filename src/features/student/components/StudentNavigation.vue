<script setup lang="ts">
import { AvNavigation, MDI_ICONS } from '@/ui'
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import { STUDENT_EDUCATION_ACTIVITIES_ROUTE, STUDENT_EDUCATION_SKILLS_ROUTE, STUDENT_HOME_ROUTE, STUDENT_PROJECT_EXPERIENCES_ROUTE, STUDENT_PROJECT_SKILLS_ROUTE, STUDENT_PROJECT_TRAJECTORIES_ROUTE, STUDENT_TOOLS_PAGES_ROUTE, STUDENT_TOOLS_RESUMES_ROUTE, STUDENT_TOOLS_TRACKS_ROUTE } from '../routes'

const { t } = useI18n()
const route = useRoute()

function isRouteActive (routes: string[]): boolean {
  return routes.includes(route.name as string)
}

const navItems = computed(() => [
  {
    id: useId(),
    to: { name: STUDENT_HOME_ROUTE },
    text: t('feature.student.navigation.tabs.home').toUpperCase(),
    icon: MDI_ICONS.HOME_VARIANT,
  },
  {
    title: t('feature.student.navigation.tabs.education.header').toUpperCase(),
    get active () {
      return isRouteActive([STUDENT_EDUCATION_SKILLS_ROUTE, STUDENT_EDUCATION_ACTIVITIES_ROUTE])
    },
    links: [
      {
        to: { name: STUDENT_EDUCATION_SKILLS_ROUTE },
        text: t('feature.student.navigation.tabs.education.items.skills'),
        icon: MDI_ICONS.STAR_SHOOTING
      },
      {
        to: { name: STUDENT_EDUCATION_ACTIVITIES_ROUTE },
        text: t('feature.student.navigation.tabs.education.items.activities'),
        icon: MDI_ICONS.GRADUATION_CAP
      },
    ],
  },
  {
    title: t('feature.student.navigation.tabs.project.header').toUpperCase(),
    get active () {
      return isRouteActive([STUDENT_PROJECT_SKILLS_ROUTE, STUDENT_PROJECT_EXPERIENCES_ROUTE, STUDENT_PROJECT_TRAJECTORIES_ROUTE])
    },
    links: [
      {
        to: { name: STUDENT_PROJECT_SKILLS_ROUTE },
        text: t('feature.student.navigation.tabs.project.items.skills'),
        icon: MDI_ICONS.STARS,
      },
      {
        to: { name: STUDENT_PROJECT_EXPERIENCES_ROUTE },
        text: t('feature.student.navigation.tabs.project.items.experiences'),
        icon: MDI_ICONS.BRIEFCASE_VARIANT,
      },
      {
        to: { name: STUDENT_PROJECT_TRAJECTORIES_ROUTE },
        text: t('feature.student.navigation.tabs.project.items.trajectories'),
        icon: MDI_ICONS.ARROW_DECISION
      },
    ],
  },
  {
    title: t('feature.student.navigation.tabs.tools.header').toUpperCase(),
    get active () {
      return isRouteActive([STUDENT_TOOLS_TRACKS_ROUTE, STUDENT_TOOLS_PAGES_ROUTE, STUDENT_TOOLS_RESUMES_ROUTE])
    },
    links: [
      {
        to: { name: STUDENT_TOOLS_TRACKS_ROUTE },
        text: t('feature.student.navigation.tabs.tools.items.tracks'),
        icon: MDI_ICONS.ATTACH_FILE
      },
      {
        to: { name: STUDENT_TOOLS_PAGES_ROUTE },
        text: t('feature.student.navigation.tabs.tools.items.pages'),
        icon: MDI_ICONS.POST_IT_NOTES
      },
      {
        to: { name: STUDENT_TOOLS_RESUMES_ROUTE },
        text: t('feature.student.navigation.tabs.tools.items.resumes'),
        icon: MDI_ICONS.FILE_ACCOUNT
      },
    ],
  },
])
</script>

<template>
  <AvNavigation :nav-items="navItems" />
</template>

<style lang="scss" scoped>
</style>
