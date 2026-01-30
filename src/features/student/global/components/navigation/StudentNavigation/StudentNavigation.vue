<script setup lang="ts">
import { ROUTES } from '@/common/constants'
import { useStudentApcAccess } from '@/features/student/global/composables/use-student-apc-access/use-student-apc-access'
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

function isRouteActive (routes: Array<{ name: string }>): boolean {
  return routes.some(avRoute => avRoute.name === route.name)
}

const educationMenu = computed(() => {
  const menu: Record<string, any> = {
    get active () {
      return isRouteActive([
        ROUTES.STUDENT.APC_UNAVAILABLE,
        ROUTES.STUDENT.EDUCATION_SKILLS,
        ROUTES.STUDENT.EDUCATION_SKILLS,
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
        },
        {
          to: ROUTES.STUDENT.EDUCATION_ACTIVITIES,
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
        ROUTES.STUDENT.TOOLS_TRACES,
        ROUTES.STUDENT.TOOLS_PAGES,
        ROUTES.STUDENT.TOOLS_RESUMES
      ])
    },
    links: [
      {
        to: ROUTES.STUDENT.TOOLS_TRACES,
        text: t('student.global.navigation.tabs.tools.items.traces'),
        icon: MDI_ICONS.ATTACH_FILE
      },
      {
        to: ROUTES.STUDENT.TOOLS_PAGES,
        text: t('student.global.navigation.tabs.tools.items.pages'),
        icon: MDI_ICONS.POST_IT_NOTES_OUTLINE
      },
      {
        to: ROUTES.STUDENT.TOOLS_RESUMES,
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
        return isRouteActive([ROUTES.STUDENT.TOOLS_TRACES])
      },
      links: [
        { to: ROUTES.STUDENT.TOOLS_TRACES, text: t('student.global.navigation.tabs.tools.items.traces'), icon: MDI_ICONS.ATTACH_FILE },
      ],
    }
  ))

const buildLifeProjectMenu = computed(() => ({
  title: t('student.global.navigation.tabs.project.header').toUpperCase(),
  get active () {
    return isRouteActive([
      ROUTES.STUDENT.PROJECT_SKILLS,
      ROUTES.STUDENT.PERSONAL_CAREER,
      ROUTES.STUDENT.PROJECT_TRAJECTORIES
    ])
  },
  links: [
    {
      to: ROUTES.STUDENT.PROJECT_SKILLS,
      text: t('student.global.navigation.tabs.project.items.skills'),
      icon: MDI_ICONS.STARS,
    },
    {
      to: __DEMO_MODE__ ? ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS : ROUTES.STUDENT.PERSONAL_CAREER,
      text: t('student.global.navigation.tabs.project.items.experiences'),
      icon: ICONS_DATA_URL.TEXT_BULLET_LIST_SPARKLE,
    },
    {
      to: ROUTES.STUDENT.PROJECT_TRAJECTORIES,
      text: t('student.global.navigation.tabs.project.items.trajectories'),
      icon: RI_ICONS.DRAW_LINE
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
    isApcVisible.value
      ? [educationMenu.value]
      : []
  ),
  buildLifeProjectMenu.value,
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
