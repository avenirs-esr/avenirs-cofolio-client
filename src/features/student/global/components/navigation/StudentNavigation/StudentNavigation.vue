<script setup lang="ts">
import { AvNavigation, ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { ICONS, ROUTES, studentActivtiesRoutes, studentPersonalCareerRoutes, studentProjectBuildProjectRoutes, studentSkillsRoutes } from '@/common/constants'
import { ROUTE_ROLES } from '@/common/constants/route-roles'
import { hasSomeRole, isRouteActive } from '@/common/utils/route/route'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'
import { studentToolsTracesRoutes } from '@/features/student/traces/routes'

const { t } = useI18n()
const route = useRoute()
const { roles } = useCurrentUser()

const toolsMenu = computed(() => ({
  id: 'nav-tools-menu',
  title: t('student.global.navigation.tabs.tools.header').toUpperCase(),
  get active () {
    return isRouteActive({ route, routes: [
      ROUTES.STUDENT.TOOLS_KIT,
      ...studentToolsTracesRoutes,
    ] })
  },
  links: !hasSomeRole(roles.value, ROUTE_ROLES.STUDENT.TOOLS)
    ? []
    : [
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

const lifeProjectMenu = computed(() => ({
  id: 'nav-life-project-menu',
  title: t('student.global.navigation.tabs.project.header').toUpperCase(),
  get active () {
    return isRouteActive({ route, routes: [
      ...studentPersonalCareerRoutes,
      ...studentProjectBuildProjectRoutes
    ] })
  },
  links: !hasSomeRole(roles.value, ROUTE_ROLES.STUDENT.PORTFOLIO)
    ? []
    : [
        {
          to: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS,
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

const navItems = computed(() => [
  {
    id: 'nav-home',
    to: ROUTES.STUDENT.HOME,
    text: t('student.global.navigation.tabs.home').toUpperCase(),
    icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
  },
  ...(hasSomeRole(roles.value, ROUTE_ROLES.STUDENT.ACTIVITIES)
    ? [{
        id: 'nav-activities',
        to: ROUTES.STUDENT.ACTIVITIES,
        text: t('student.global.navigation.tabs.activities').toUpperCase(),
        icon: ICONS.ACTIVITY,
        highlight: isRouteActive({ route, routes: studentActivtiesRoutes })
      }]
    : []),
  ...(hasSomeRole(roles.value, ROUTE_ROLES.STUDENT.PORTFOLIO)
    ? [{
        id: 'nav-skills',
        to: ROUTES.STUDENT.SKILLS,
        text: t('student.global.navigation.tabs.skills').toUpperCase(),
        icon: ICONS.SKILLS,
        highlight: isRouteActive({ route, routes: studentSkillsRoutes })
      }]
    : []),
  ...[lifeProjectMenu.value, toolsMenu.value].filter(menu => menu.links.length),
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
