<script setup lang="ts">
import type { NavigationMenuProps } from 'node_modules/@avenirs-esr/avenirs-dsav/dist/components/navigation/AvNavigation/components/NavigationMenu/NavigationMenu.vue'
import type { NavigationMenuLinkProps } from 'node_modules/@avenirs-esr/avenirs-dsav/dist/components/navigation/AvNavigation/components/NavigationMenuLink/NavigationMenuLink.vue'
import { AvNavigation, ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { ICONS, ROUTES, studentActivtiesRoutes, studentPersonalCareerRoutes, studentProjectBuildProjectRoutes, studentSkillsRoutes } from '@/common/constants'
import { canAccessRoute } from '@/common/utils/route/access/route-access'
import { isRouteActive } from '@/common/utils/route/route'
import { studentToolsTracesRoutes } from '@/features/student/traces/routes'

const { t } = useI18n()
const route = useRoute()

const toolsMenu = computed(() => ({
  id: 'nav-tools-menu',
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
  ].filter(link => canAccessRoute(link.to)),
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
  links: [
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
  ].filter(link => canAccessRoute(link.to)),
}))

const navItems = computed(() => {
  const items: (NavigationMenuLinkProps | NavigationMenuProps)[] = [
    {
      id: 'nav-home',
      to: ROUTES.STUDENT.HOME,
      text: t('student.global.navigation.tabs.home').toUpperCase(),
      icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
    },
  ]

  if (canAccessRoute(ROUTES.STUDENT.ACTIVITIES)) {
    items.push({
      id: 'nav-activities',
      to: ROUTES.STUDENT.ACTIVITIES,
      text: t('student.global.navigation.tabs.activities').toUpperCase(),
      icon: ICONS.ACTIVITY,
      highlight: isRouteActive({ route, routes: studentActivtiesRoutes })
    })
  }

  if (canAccessRoute(ROUTES.STUDENT.SKILLS)) {
    items.push({
      id: 'nav-skills',
      to: ROUTES.STUDENT.SKILLS,
      text: t('student.global.navigation.tabs.skills').toUpperCase(),
      icon: ICONS.SKILLS,
      highlight: isRouteActive({ route, routes: studentSkillsRoutes })
    })
  }

  if (lifeProjectMenu.value.links.length) {
    items.push(lifeProjectMenu.value)
  }

  if (toolsMenu.value.links.length) {
    items.push(toolsMenu.value)
  }

  return items
})
</script>

<template>
  <AvNavigation
    :nav-items="navItems"
    data-testid="main-navigation"
  />
</template>

<style lang="scss" scoped>
</style>
