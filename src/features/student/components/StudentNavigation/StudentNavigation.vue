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
  studentToolsTracesRoute
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

const educationMenu = computed(() => {
  const menu: Record<string, any> = {
    get active () {
      return isRouteActive([
        studentApcUnavailableRoute,
        studentEducationSkillsRoute,
        studentEducationActivitiesRoute,
      ])
    },
  }

  if (!showApcGenericInfoPage.value) {
    menu.title = t('student.navigation.tabs.education.header').toUpperCase()
  }
  if (!showApcSubmenus.value) {
    menu.text = t('student.navigation.tabs.education.header').toUpperCase()
  }
  if (showApcGenericInfoPage.value) {
    menu.to = studentApcUnavailableRoute
  }
  if (showApcSubmenus.value) {
    menu.links = [
      {
        to: studentEducationSkillsRoute,
        text: t('student.navigation.tabs.education.items.skills'),
        icon: MDI_ICONS.STARS,
      },
      {
        to: studentEducationActivitiesRoute,
        text: t('student.navigation.tabs.education.items.activities'),
        icon: MDI_ICONS.CALENDAR_MONTH,
      },
    ]
  }

  return menu
})

const homeItemId = useId()
const navItems = computed(() => [
  {
    id: homeItemId,
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
      return isRouteActive([studentToolsTracesRoute, studentToolsPagesRoute, studentToolsResumesRoute])
    },
    links: [
      { to: studentToolsTracesRoute, text: t('student.navigation.tabs.tools.items.traces'), icon: MDI_ICONS.ATTACH_FILE },
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
