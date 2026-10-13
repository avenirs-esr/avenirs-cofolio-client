<script setup lang="ts">
import { ICONS, ROUTES } from '@/common/constants'
import { isRouteActive } from '@/common/utils/route/route'
import { staffActivitiesRoutes } from '@/features/staff/activities/routes'
import { staffAdminGroupsRoute, staffAdminRoutes, staffAdminSkillsRoute, staffAdminUsersRoute } from '@/features/staff/admin/routes'
import { staffStudentTrackingFeedbacksRoutes } from '@/features/staff/feedbacks/routes'
import { AvNavigation, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const studentTrackingMenu = computed(() => ({
  id: 'nav-student-tracking-menu',
  title: t('staff.global.navigation.tabs.studentTracking').toUpperCase(),
  get active () {
    return isRouteActive({ route, routes: staffStudentTrackingFeedbacksRoutes })
  },
  links: [
    {
      to: ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS,
      text: t('staff.global.navigation.tabs.studentFeedbacks'),
      icon: ICONS.FEEDBACK,
      highlight: isRouteActive({ route, routes: staffStudentTrackingFeedbacksRoutes }),
    },
  ],
}))

const adminMenu = computed(() => ({
  id: 'nav-admin-menu',
  title: t('staff.global.navigation.tabs.admin.header').toUpperCase(),
  get active () {
    return isRouteActive({ route, routes: staffAdminRoutes })
  },
  links: [
    {
      to: ROUTES.STAFF.ADMIN.USERS,
      text: t('staff.global.navigation.tabs.admin.items.users'),
      icon: MDI_ICONS.ACCOUNT_STUDENT_OUTLINE,
      highlight: isRouteActive({ route, routes: [staffAdminUsersRoute] }),
    },
    {
      to: ROUTES.STAFF.ADMIN.GROUPS,
      text: t('staff.global.navigation.tabs.admin.items.groups'),
      icon: MDI_ICONS.PEOPLE_GROUP_OUTLINE,
      highlight: isRouteActive({ route, routes: [staffAdminGroupsRoute] }),
    },
    {
      to: ROUTES.STAFF.ADMIN.SKILLS,
      text: t('staff.global.navigation.tabs.admin.items.skills'),
      icon: ICONS.SKILLS,
      highlight: isRouteActive({ route, routes: [staffAdminSkillsRoute] }),
    },
  ],
}))

const navItems = computed(() => [
  {
    id: 'nav-home',
    to: ROUTES.STAFF.HOME,
    text: t('staff.global.navigation.tabs.home').toUpperCase(),
    icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
  },
  {
    id: 'nav-activities',
    to: ROUTES.STAFF.ACTIVITIES,
    text: t('staff.global.navigation.tabs.activities.header').toUpperCase(),
    icon: ICONS.ACTIVITY,
    highlight: isRouteActive({ route, routes: staffActivitiesRoutes }),
  },
  studentTrackingMenu.value,
  adminMenu.value,
])
</script>

<template>
  <AvNavigation
    :nav-items="navItems"
    data-testid="main-navigation"
  />
</template>
