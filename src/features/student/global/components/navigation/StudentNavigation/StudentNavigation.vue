<script setup lang="ts">
import { ICONS, ROUTES, studentPersonalCareerRoutes, studentProjectActivtiesRoutes, studentProjectTrajectoriesRoutes } from '@/common/constants'
import { isRouteActive } from '@/common/utils/route/route'
import { useStudentApcAccess } from '@/features/student/global/composables/use-student-apc-access/use-student-apc-access'
import { studentToolsTracesRoutes } from '@/features/student/traces/routes'
import { AvNavigation, ICONS_DATA_URL, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const {
  isApcVisible,
  showApcGenericInfoPage,
  showApcSubmenus,
} = useStudentApcAccess()

const personalCareerNavigationTarget = computed(() => {
  if (isRouteActive({ route, routes: studentPersonalCareerRoutes })) {
    return route.fullPath
  }

  return ROUTES.STUDENT.PERSONAL_CAREER
})

const projectActivitiesLink = computed(() => ({
  to: ROUTES.STUDENT.PROJECT_ACTIVITIES,
  highlight: isRouteActive({ route, routes: studentProjectActivtiesRoutes }),
}))

const projectTrajectoriesLink = computed(() => ({
  to: ROUTES.STUDENT.PROJECT_TRAJECTORIES,
  highlight: isRouteActive({ route, routes: studentProjectTrajectoriesRoutes }),
}))

const toolTracesLink = computed(() => ({
  to: ROUTES.STUDENT.TOOLS_TRACES,
  highlight: isRouteActive({ route, routes: studentToolsTracesRoutes }),
}))

const educationMenu = computed(() => {
  const menu: Record<string, any> = {
    get active () {
      return isRouteActive({ route, routes: [
        ROUTES.STUDENT.APC_UNAVAILABLE,
        ROUTES.STUDENT.EDUCATION_SKILLS,
        ROUTES.STUDENT.EDUCATION_SKILLS,
      ] })
    },
  }

  if (!showApcGenericInfoPage.value) {
    menu.title = t('student.global.navigation.tabs.education.header').toUpperCase()
  }
  if (!showApcSubmenus.value) {
    menu.text = t('student.global.navigation.tabs.education.header').toUpperCase()
  }
  if (showApcGenericInfoPage.value) {
    menu.to = ROUTES.STUDENT.APC_UNAVAILABLE
  }
  if (showApcSubmenus.value) {
    if (__DEMO_MODE__) {
      menu.links = [
        {
          to: ROUTES.STUDENT.EDUCATION_SKILLS,
          text: t('student.global.navigation.tabs.education.items.skills'),
          icon: MDI_ICONS.STARS,
        },
      ]
    }
    else {
      menu.links = [
        {
          to: ROUTES.STUDENT.EDUCATION_SKILLS,
          text: t('student.global.navigation.tabs.education.items.skills'),
          icon: MDI_ICONS.STARS,
        }
      ]
    }
  }

  return menu
})

const toolsMenu
  = computed(() => ({
    title: t('student.global.navigation.tabs.tools.header').toUpperCase(),
    get active () {
      return isRouteActive({ route, routes: [
        ROUTES.STUDENT.TOOLS_KIT,
        ...studentToolsTracesRoutes,
      ] })
    },
    links: [
      {
        ...toolTracesLink.value,
        text: t('student.global.navigation.tabs.tools.items.traces'),
        icon: MDI_ICONS.ATTACH_FILE
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
      ROUTES.STUDENT.PROJECT_SKILLS,
      ...studentPersonalCareerRoutes,
      ...studentProjectActivtiesRoutes,
      ...studentProjectTrajectoriesRoutes
    ] })
  },
  links: [
    {
      to: ROUTES.STUDENT.PROJECT_SKILLS,
      text: t('student.global.navigation.tabs.project.items.skills'),
      icon: MDI_ICONS.STARS,
    },
    {
      to: __DEMO_MODE__ ? ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS : personalCareerNavigationTarget.value,
      text: t('student.global.navigation.tabs.project.items.experiences'),
      icon: ICONS_DATA_URL.TEXT_BULLET_LIST_SPARKLE,
    },
    {
      ...projectTrajectoriesLink.value,
      text: t('student.global.navigation.tabs.project.items.trajectories'),
      icon: RI_ICONS.DRAW_LINE,
    },
    {
      ...projectActivitiesLink.value,
      text: t('student.global.navigation.tabs.project.items.activities'),
      icon: ICONS.ACTIVITY,
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
  ...(
    !__DEMO_MODE__ && isApcVisible.value
      ? [educationMenu.value]
      : []
  ),
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
