<script setup lang="ts">
import { ROUTE_NAMES } from '@/common/constants'
import { useStudentApcAccess } from '@/features/student/global/composables/use-student-apc-access/use-student-apc-access'
import { AvNavigation, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useId } from 'vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const {
  isApcVisible,
  showApcGenericInfoPage,
  showApcSubmenus,
} = useStudentApcAccess()

function isRouteActive (routes: Array<{ name: string }>): boolean {
  return routes.some(avRoute => avRoute.name === route.name)
}

const educationMenu = computed(() => {
  const menu: Record<string, any> = {
    get active () {
      return isRouteActive([
        ROUTE_NAMES.STUDENT.APC_UNAVAILABLE,
        ROUTE_NAMES.STUDENT.EDUCATION_SKILLS,
        ROUTE_NAMES.STUDENT.EDUCATION_SKILLS,
      ])
    },
  }

  if (!showApcGenericInfoPage.value) {
    menu.title = t('student.global.navigation.tabs.education.header').toUpperCase()
  }
  if (!showApcSubmenus.value) {
    menu.text = t('student.global.navigation.tabs.education.header').toUpperCase()
  }
  if (showApcGenericInfoPage.value) {
    menu.to = ROUTE_NAMES.STUDENT.APC_UNAVAILABLE
  }
  if (showApcSubmenus.value) {
    if (__DEMO_MODE__) {
      menu.links = [
        {
          to: ROUTE_NAMES.STUDENT.EDUCATION_SKILLS,
          text: t('student.global.navigation.tabs.education.items.skills'),
          icon: MDI_ICONS.STARS,
        },
      ]
    }
    else {
      menu.links = [
        {
          to: ROUTE_NAMES.STUDENT.EDUCATION_SKILLS,
          text: t('student.global.navigation.tabs.education.items.skills'),
          icon: MDI_ICONS.STARS,
        },
        {
          to: ROUTE_NAMES.STUDENT.EDUCATION_ACTIVITIES,
          text: t('student.global.navigation.tabs.education.items.activities'),
          icon: MDI_ICONS.CALENDAR_MONTH_OUTLINE,
        },
      ]
    }
  }

  return menu
})

const allToolsMenu
  = computed(() => ({
    title: t('student.global.navigation.tabs.tools.header').toUpperCase(),
    get active () {
      return isRouteActive([
        ROUTE_NAMES.STUDENT.TOOLS_TRACES,
        ROUTE_NAMES.STUDENT.TOOLS_PAGES,
        ROUTE_NAMES.STUDENT.TOOLS_RESUMES
      ])
    },
    links: [
      {
        to: ROUTE_NAMES.STUDENT.TOOLS_TRACES,
        text: t('student.global.navigation.tabs.tools.items.traces'),
        icon: MDI_ICONS.ATTACH_FILE
      },
      {
        to: ROUTE_NAMES.STUDENT.TOOLS_PAGES,
        text: t('student.global.navigation.tabs.tools.items.pages'),
        icon: MDI_ICONS.POST_IT_NOTES_OUTLINE
      },
      {
        to: ROUTE_NAMES.STUDENT.TOOLS_RESUMES,
        text: t('student.global.navigation.tabs.tools.items.resumes'),
        icon: MDI_ICONS.FILE_ACCOUNT_OUTLINE
      },
    ],
  }))

const demoModeToolsMenu
  = computed(() => (
    {
      title: t('student.global.navigation.tabs.tools.header').toUpperCase(),
      get active () {
        return isRouteActive([ROUTE_NAMES.STUDENT.TOOLS_TRACES])
      },
      links: [
        { to: ROUTE_NAMES.STUDENT.TOOLS_TRACES, text: t('student.global.navigation.tabs.tools.items.traces'), icon: MDI_ICONS.ATTACH_FILE },
      ],
    }
  ))

const buildLifeProjectMenu = computed(() => ({
  title: t('student.global.navigation.tabs.project.header').toUpperCase(),
  get active () {
    return isRouteActive([
      ROUTE_NAMES.STUDENT.PROJECT_SKILLS,
      ROUTE_NAMES.STUDENT.PROJECT_EXPERIENCES,
      ROUTE_NAMES.STUDENT.PROJECT_TRAJECTORIES
    ])
  },
  links: [
    {
      to: ROUTE_NAMES.STUDENT.PROJECT_SKILLS,
      text: t('student.global.navigation.tabs.project.items.skills'),
      icon: MDI_ICONS.STARS,
    },
    {
      to: ROUTE_NAMES.STUDENT.PROJECT_EXPERIENCES,
      text: t('student.global.navigation.tabs.project.items.experiences'),
      icon: MDI_ICONS.BRIEFCASE_VARIANT_OUTLINE,
    },
    {
      to: ROUTE_NAMES.STUDENT.PROJECT_TRAJECTORIES,
      text: t('student.global.navigation.tabs.project.items.trajectories'),
      icon: MDI_ICONS.ARROW_DECISION
    },
  ],
}))

const demoModeBuildLifeProjectMenu
  = computed(() => (
    {
      title: t('student.global.navigation.tabs.project.header').toUpperCase(),
      get active () {
        return isRouteActive([
          ROUTE_NAMES.STUDENT.PROJECT_SKILLS,
          ROUTE_NAMES.STUDENT.PROJECT_TRAJECTORIES
        ])
      },
      links: [
        {
          to: ROUTE_NAMES.STUDENT.PROJECT_SKILLS,
          text: t('student.global.navigation.tabs.project.items.skills'),
          icon: MDI_ICONS.STARS,
        },
        {
          to: ROUTE_NAMES.STUDENT.PROJECT_TRAJECTORIES,
          text: t('student.global.navigation.tabs.project.items.trajectories'),
          icon: MDI_ICONS.ARROW_DECISION
        },
      ],
    }
  ))

const homeItemId = useId()
const navItems = computed(() => [
  {
    id: homeItemId,
    to: ROUTE_NAMES.STUDENT.HOME,
    text: t('student.global.navigation.tabs.home').toUpperCase(),
    icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
  },
  ...(
    isApcVisible.value
      ? [educationMenu.value]
      : []
  ),
  ...(
    __DEMO_MODE__
      ? [demoModeBuildLifeProjectMenu.value]
      : [buildLifeProjectMenu.value]
  ),
  ...(
    __DEMO_MODE__
      ? [demoModeToolsMenu.value]
      : [allToolsMenu.value]
  ),
])
</script>

<template>
  <AvNavigation :nav-items="navItems" />
</template>

<style lang="scss" scoped>
</style>
