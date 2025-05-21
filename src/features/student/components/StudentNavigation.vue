<script setup lang="ts">
import type { AvRoute } from '@/common/types'
import { useStudentFeatures } from '@/features/student/composables'

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
import { StudentFeatures } from '@/types'
import { AvNavigation, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const { hasFeature } = useStudentFeatures()

function isRouteActive (routes: AvRoute[]): boolean {
  return routes.some(avRoute => avRoute.name === route.name)
}

const navItems = computed(() => [
  {
    to: studentHomeRoute,
    text: t('student.navigation.tabs.home').toUpperCase(),
    icon: MDI_ICONS.HOME_VARIANT,
  },
  {
    feature: StudentFeatures.APC,
    title: t('student.navigation.tabs.education.header').toUpperCase(),
    get active () {
      return isRouteActive([studentEducationSkillsRoute, studentEducationActivitiesRoute])
    },
    links: [
      { to: studentEducationSkillsRoute, text: t('student.navigation.tabs.education.items.skills'), icon: MDI_ICONS.STAR_SHOOTING },
      { to: studentEducationActivitiesRoute, text: t('student.navigation.tabs.education.items.activities'), icon: MDI_ICONS.GRADUATION_CAP },
    ],
  },
  {
    feature: StudentFeatures.LIFE_PROJECT,
    title: t('student.navigation.tabs.project.header').toUpperCase(),
    get active () {
      return isRouteActive([studentProjectSkillsRoute, studentProjectExperiencesRoute, studentProjectTrajectoriesRoute])
    },
    links: [
      {
        to: studentProjectSkillsRoute,
        text: t('student.navigation.tabs.project.items.skills'),
        icon: MDI_ICONS.STARS,
      },
      {
        to: studentProjectExperiencesRoute,
        text: t('student.navigation.tabs.project.items.experiences'),
        icon: MDI_ICONS.BRIEFCASE_VARIANT,
      },
      { to: studentProjectTrajectoriesRoute, text: t('student.navigation.tabs.project.items.trajectories'), icon: MDI_ICONS.ARROW_DECISION },
    ],
  },
  {
    title: t('student.navigation.tabs.tools.header').toUpperCase(),
    get active () {
      return isRouteActive([studentToolsTracksRoute, studentToolsPagesRoute, studentToolsResumesRoute])
    },
    links: [
      { to: studentToolsTracksRoute, text: t('student.navigation.tabs.tools.items.tracks'), icon: MDI_ICONS.ATTACH_FILE },
      { to: studentToolsPagesRoute, text: t('student.navigation.tabs.tools.items.pages'), icon: MDI_ICONS.POST_IT_NOTES },
      { to: studentToolsResumesRoute, text: t('student.navigation.tabs.tools.items.resumes'), icon: MDI_ICONS.FILE_ACCOUNT },
    ],
  },
])

const renderedNavItems = computed(() => navItems.value
  .slice()
  .filter(item => !item.feature || hasFeature(item.feature as StudentFeatures).value))
</script>

<template>
  <AvNavigation :nav-items="renderedNavItems" />
</template>

<style lang="scss" scoped>
</style>
