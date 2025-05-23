<script setup lang="ts">
import type { AvRoute } from '@/common/types'
import { useStudentApcAccess } from '@/features/student/composables'
import {
  studentApcUnavailableRoute,
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

const {
  isApcVisible,
  showApcGenericInfoPage,
  showApcSubmenus,
} = useStudentApcAccess()

function isRouteActive (routes: AvRoute[]): boolean {
  return routes.some(avRoute => avRoute.name === route.name)
}

const educationMenu = computed(() => ({
  title: t('student.navigation.tabs.education.header').toUpperCase(),
  text: t('student.navigation.tabs.education.header').toUpperCase(),
  to: showApcGenericInfoPage.value ? studentApcUnavailableRoute : undefined,
  get active () {
    return isRouteActive([studentApcUnavailableRoute, studentEducationSkillsRoute, studentEducationActivitiesRoute])
  },
  links: showApcSubmenus.value
    ? [
        { to: studentEducationSkillsRoute, text: t('student.navigation.tabs.education.items.skills'), icon: MDI_ICONS.STAR_SHOOTING },
        { to: studentEducationActivitiesRoute, text: t('student.navigation.tabs.education.items.activities'), icon: MDI_ICONS.GRADUATION_CAP },
      ]
    : undefined,
}))

const navItems = computed(() => [
  {
    id: useId(),
    to: studentHomeRoute,
    text: t('student.navigation.tabs.home').toUpperCase(),
    icon: MDI_ICONS.HOME_VARIANT,
  },
  ...(
    isApcVisible.value
      ? [educationMenu.value]
      : []
  ),
  {
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
</script>

<template>
  <AvNavigation :nav-items="navItems" />
</template>

<style lang="scss" scoped>
</style>
