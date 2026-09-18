<script setup lang="ts">
import { ICONS, ROUTES, studentActivtiesRoutes, studentPersonalCareerRoutes, studentProjectBuildProjectRoutes, studentSkillsRoutes } from '@/common/constants'
import { isRouteActive } from '@/common/utils/route/route'
import { studentToolsTracesRoutes } from '@/features/student/traces/routes'
import { AvNavigation, ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const personalCareerNavigationTarget = computed(() => {
  if (isRouteActive({ route, routes: studentPersonalCareerRoutes })) {
    return route.fullPath
  }

  return ROUTES.STUDENT.PERSONAL_CAREER
})

const toolsMenu = computed(() => ({
  title: t('student.global.navigation.tabs.tools.header').toUpperCase(),
  get active () {
    return isRouteActive({ route, routes: [
      ROUTES.STUDENT.TOOLS_KIT,
      ...studentToolsTracesRoutes,
    ] })
  },
  links: [
    {
      to: ROUTES.STUDENT.TOOLS_TRACES,
      text: t('student.global.navigation.tabs.tools.items.traces'),
      icon: ICONS.TRACES,
      highlight: isRouteActive({ route, routes: studentToolsTracesRoutes })
    },
    {
      to: ROUTES.STUDENT.TOOLS_KIT,
      text: t('student.global.navigation.tabs.tools.items.kit'),
      icon: MDI_ICONS.TOOLS
    },
  ],
}))

const buildLifeProjectMenu = computed(() => ({
  title: t('student.global.navigation.tabs.project.header').toUpperCase(),
  get active () {
    return isRouteActive({ route, routes: [
      ...studentPersonalCareerRoutes,
      ...studentProjectBuildProjectRoutes
    ] })
  },
  links: [
    {
      to: __DEMO_MODE__ ? ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS : personalCareerNavigationTarget.value,
      text: t('student.global.navigation.tabs.project.items.experiences'),
      icon: ICONS_DATA_URL.TEXT_BULLET_LIST_SPARKLE,
    },
    {
      to: ROUTES.STUDENT.BUILD_PROJECT,
      text: t('student.global.navigation.tabs.project.items.buildProject'),
      icon: ICONS.BUILD_PROJECT,
      highlight: isRouteActive({ route, routes: studentProjectBuildProjectRoutes })
    },
  ],
}))

const homeItemId = useId()
const navItems = computed(() => [
  {
    id: homeItemId,
    to: ROUTES.STUDENT.HOME,
    text: t('student.global.navigation.tabs.home').toUpperCase(),
    icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
  },
  {
    to: ROUTES.STUDENT.ACTIVITIES,
    text: t('student.global.navigation.tabs.activities').toUpperCase(),
    icon: ICONS.ACTIVITY,
    highlight: isRouteActive({ route, routes: studentActivtiesRoutes })
  },
  {
    to: ROUTES.STUDENT.SKILLS,
    text: t('student.global.navigation.tabs.skills').toUpperCase(),
    icon: ICONS.SKILLS,
    highlight: isRouteActive({ route, routes: studentSkillsRoutes })
  },
  buildLifeProjectMenu.value,
  toolsMenu.value,
])
</script>

<template>
  <AvNavigation
    :nav-items="navItems"
    data-testid="main-navigation"
  />
</template>

<style lang="scss" scoped>
</style>
