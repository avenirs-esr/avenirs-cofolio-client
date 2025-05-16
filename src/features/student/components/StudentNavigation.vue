<script setup lang="ts">
import type { AvRoute } from '@/common/types/router.types'
import {
  studentEducationActivitiesRoute,
  studentEducationSkillsRoute,
  studentHomeRoute,
  studentProjectExperiencesRoute,
  studentProjectSkillsRoute,
  studentProjectTrajectoriesRoute,
  studentToolsPagesRoute,
  studentToolsResumesRoute,
  studentToolsTracksRoute
} from '@/features/student/routes'
import { AvNavigation, MDI_ICONS } from '@/ui'
import { useId } from 'vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

function isRouteActive (routes: AvRoute[]): boolean {
  return routes.some(avRoute => avRoute.name === route.name)
}

const navItems = computed(() => [
  {
    id: useId(),
    to: studentHomeRoute,
    text: t('feature.student.navigation.tabs.home').toUpperCase(),
    icon: MDI_ICONS.HOME_VARIANT,
  },
  {
    title: t('feature.student.navigation.tabs.education.header').toUpperCase(),
    get active () {
      return isRouteActive([studentEducationSkillsRoute, studentEducationActivitiesRoute])
    },
    links: [
      { to: studentEducationSkillsRoute, text: t('feature.student.navigation.tabs.education.items.skills'), icon: MDI_ICONS.STAR_SHOOTING },
      { to: studentEducationActivitiesRoute, text: t('feature.student.navigation.tabs.education.items.activities'), icon: MDI_ICONS.GRADUATION_CAP },
    ],
  },
  {
    title: t('feature.student.navigation.tabs.project.header').toUpperCase(),
    get active () {
      return isRouteActive([studentProjectSkillsRoute, studentProjectExperiencesRoute, studentProjectTrajectoriesRoute])
    },
    links: [
      {
        to: studentProjectSkillsRoute,
        text: t('feature.student.navigation.tabs.project.items.skills'),
        icon: MDI_ICONS.STARS,
      },
      {
        to: studentProjectExperiencesRoute,
        text: t('feature.student.navigation.tabs.project.items.experiences'),
        icon: MDI_ICONS.BRIEFCASE_VARIANT,
      },
      { to: studentProjectTrajectoriesRoute, text: t('feature.student.navigation.tabs.project.items.trajectories'), icon: MDI_ICONS.ARROW_DECISION },
    ],
  },
  {
    title: t('feature.student.navigation.tabs.tools.header').toUpperCase(),
    get active () {
      return isRouteActive([studentToolsTracksRoute, studentToolsPagesRoute, studentToolsResumesRoute])
    },
    links: [
      { to: studentToolsTracksRoute, text: t('feature.student.navigation.tabs.tools.items.tracks'), icon: MDI_ICONS.ATTACH_FILE },
      { to: studentToolsPagesRoute, text: t('feature.student.navigation.tabs.tools.items.pages'), icon: MDI_ICONS.POST_IT_NOTES },
      { to: studentToolsResumesRoute, text: t('feature.student.navigation.tabs.tools.items.resumes'), icon: MDI_ICONS.FILE_ACCOUNT },
    ],
  },
])
</script>

<template>
  <AvNavigation :nav-items="navItems" />
</template>

<style lang="scss" scoped>
</style>
