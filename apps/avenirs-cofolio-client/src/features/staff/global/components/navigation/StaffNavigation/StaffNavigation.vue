<script setup lang="ts">
import type { NavigationMenuLinkProps, NavigationMenuProps } from '@avenirs-esr/avenirs-dsav'
import { AvNavigation, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { ICONS, ROUTES } from '@/common/constants'
import { ROUTE_ROLES } from '@/common/constants/route-roles'
import { hasSomeRole, isRouteActive } from '@/common/utils/route/route'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'
import { staffActivitiesRoutes } from '@/features/staff/activities/routes'
import { staffAdminGroupsRoute, staffAdminRoutes, staffAdminSkillsRoute, staffAdminUsersRoute } from '@/features/staff/admin/routes'
import { staffStudentTrackingAssessmentsRoutes } from '@/features/staff/assessments/routes'
import { staffStudentTrackingFeedbacksRoutes } from '@/features/staff/feedbacks/routes'

const { t } = useI18n()
const route = useRoute()
const { roles } = useCurrentUser()

const studentTrackingMenu = computed(() => {
  const links: NavigationMenuLinkProps[] = []

  if (hasSomeRole(roles.value, ROUTE_ROLES.STAFF.FEEDBACKS)) {
    links.push({
      to: ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS,
      text: t('staff.global.navigation.tabs.studentFeedbacks'),
      icon: ICONS.FEEDBACK,
      highlight: isRouteActive({ route, routes: staffStudentTrackingFeedbacksRoutes }),
    })
  }

  if (hasSomeRole(roles.value, ROUTE_ROLES.STAFF.ASSESSMENTS)) {
    links.push({
      to: ROUTES.STAFF.STUDENT_TRACKING.ASSESSMENTS,
      text: t('staff.global.navigation.tabs.studentAssessments'),
      icon: ICONS.ASSESSMENT,
      highlight: isRouteActive({ route, routes: staffStudentTrackingAssessmentsRoutes }),
    })
  }

  return {
    id: 'nav-student-tracking-menu',
    title: t('staff.global.navigation.tabs.studentTracking').toUpperCase(),
    get active () {
      return isRouteActive({ route, routes: [...staffStudentTrackingFeedbacksRoutes, ...staffStudentTrackingAssessmentsRoutes] })
    },
    links,
  }
})

const adminMenu = computed(() => {
  const links: NavigationMenuLinkProps[] = []

  if (hasSomeRole(roles.value, ROUTE_ROLES.STAFF.ADMIN_USERS)) {
    links.push({
      to: ROUTES.STAFF.ADMIN.USERS,
      text: t('staff.global.navigation.tabs.admin.items.users'),
      icon: MDI_ICONS.ACCOUNT_STUDENT_OUTLINE,
      highlight: isRouteActive({ route, routes: [staffAdminUsersRoute] }),
    })
  }

  if (hasSomeRole(roles.value, ROUTE_ROLES.STAFF.ADMIN_GROUPS)) {
    links.push({
      to: ROUTES.STAFF.ADMIN.GROUPS,
      text: t('staff.global.navigation.tabs.admin.items.groups'),
      icon: MDI_ICONS.PEOPLE_GROUP_OUTLINE,
      highlight: isRouteActive({ route, routes: [staffAdminGroupsRoute] }),
    })
  }

  if (hasSomeRole(roles.value, ROUTE_ROLES.STAFF.ADMIN_SKILLS)) {
    links.push({
      to: ROUTES.STAFF.ADMIN.SKILLS,
      text: t('staff.global.navigation.tabs.admin.items.skills'),
      icon: ICONS.SKILLS,
      highlight: isRouteActive({ route, routes: [staffAdminSkillsRoute] }),
    })
  }

  return {
    id: 'nav-admin-menu',
    title: t('staff.global.navigation.tabs.admin.header').toUpperCase(),
    get active () {
      return isRouteActive({ route, routes: staffAdminRoutes })
    },
    links
  }
})

const navItems = computed(() => {
  const items: (NavigationMenuLinkProps | NavigationMenuProps)[] = [
    {
      id: 'nav-home',
      to: ROUTES.STAFF.HOME,
      text: t('staff.global.navigation.tabs.home').toUpperCase(),
      icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
    },
  ]

  if (hasSomeRole(roles.value, ROUTE_ROLES.STAFF.ACTIVITIES)) {
    items.push({
      id: 'nav-activities',
      to: ROUTES.STAFF.ACTIVITIES,
      text: t('staff.global.navigation.tabs.activities.header').toUpperCase(),
      icon: ICONS.ACTIVITY,
      highlight: isRouteActive({ route, routes: staffActivitiesRoutes }),
    })
  }

  if (studentTrackingMenu.value.links.length) {
    items.push(studentTrackingMenu.value)
  }

  if (adminMenu.value.links.length) {
    items.push(adminMenu.value)
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
