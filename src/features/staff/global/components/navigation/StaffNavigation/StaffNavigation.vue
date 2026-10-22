<script setup lang="ts">
import type { NavigationMenuProps } from 'node_modules/@avenirs-esr/avenirs-dsav/dist/components/navigation/AvNavigation/components/NavigationMenu/NavigationMenu.vue'
import type { NavigationMenuLinkProps } from 'node_modules/@avenirs-esr/avenirs-dsav/dist/components/navigation/AvNavigation/components/NavigationMenuLink/NavigationMenuLink.vue'
import { AvNavigation, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { ICONS, ROUTES } from '@/common/constants'
import { ROUTE_ROLES } from '@/common/constants/route-roles'
import { hasSomeRole, isRouteActive } from '@/common/utils/route/route'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'
import { staffActivitiesRoutes } from '@/features/staff/activities/routes'
import { staffAdminGroupsRoute, staffAdminInstitutionsRoute, staffAdminPermissionsRoute, staffAdminProgramsRoute, staffAdminRolesRoute, staffAdminRoutes, staffAdminSkillsRoute, staffAdminToolsRoutes, staffAdminUsersRoute } from '@/features/staff/admin/routes'
import { staffStudentTrackingFeedbacksRoutes } from '@/features/staff/feedbacks/routes'

const { t } = useI18n()
const route = useRoute()
const { roles } = useCurrentUser()

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
      to: ROUTES.STAFF.ADMIN.INSTITUTIONS,
      text: t('staff.global.navigation.tabs.admin.items.institutions'),
      icon: MDI_ICONS.BUILDING,
      highlight: isRouteActive({ route, routes: [staffAdminInstitutionsRoute] }),
    },
    {
      to: ROUTES.STAFF.ADMIN.USERS,
      text: t('staff.global.navigation.tabs.admin.items.users'),
      icon: MDI_ICONS.ACCOUNT_STUDENT_OUTLINE,
      highlight: isRouteActive({ route, routes: [staffAdminUsersRoute] }),
    },
    {
      to: ROUTES.STAFF.ADMIN.PROGRAMS,
      text: t('staff.global.navigation.tabs.admin.items.programs'),
      icon: ICONS.PROGRAMS,
      highlight: isRouteActive({ route, routes: [staffAdminProgramsRoute] }),
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
    {
      to: ROUTES.STAFF.ADMIN.TOOLS,
      text: t('staff.global.navigation.tabs.admin.items.tools'),
      icon: MDI_ICONS.TOOLS,
      highlight: isRouteActive({ route, routes: [staffAdminToolsRoutes] }),
    },
    {
      to: ROUTES.STAFF.ADMIN.ROLES,
      text: t('staff.global.navigation.tabs.admin.items.roles'),
      icon: MDI_ICONS.BADGE_ACCOUNT_HORIZONTAL_OUTLINE,
      highlight: isRouteActive({ route, routes: [staffAdminRolesRoute] }),
    },
    {
      to: ROUTES.STAFF.ADMIN.PERMISSIONS,
      text: t('staff.global.navigation.tabs.admin.items.permissions'),
      icon: MDI_ICONS.LOCK_OUTLINE,
      highlight: isRouteActive({ route, routes: [staffAdminPermissionsRoute] }),
    },
  ],
}))

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

  if (hasSomeRole(roles.value, ROUTE_ROLES.STAFF.FEEDBACKS)) {
    items.push(studentTrackingMenu.value)
  }

  if (hasSomeRole(roles.value, ROUTE_ROLES.STAFF.ADMIN)) {
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
