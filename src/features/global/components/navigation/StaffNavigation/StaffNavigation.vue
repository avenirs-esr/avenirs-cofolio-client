<script setup lang="ts">
import { ICONS, ROUTES } from '@/common/constants'
import { isRouteActive } from '@/common/utils/route/route'
import { staffActivitiesRoutes } from '@/features/activities/routes'
import { staffStudentTrackingFeedbacksRoutes } from '@/features/feedbacks/routes'
import { AvNavigation, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const studentTrackingMenu = computed(() => ({
  title: t('staff.global.navigation.tabs.studentTracking').toUpperCase(),
  get active () {
    return isRouteActive({ route, routes: staffStudentTrackingFeedbacksRoutes })
  },
  links: [
    {
      to: ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS,
      text: t('staff.global.navigation.tabs.studentFeedbacks'),
      icon: MDI_ICONS.PEOPLE_GROUP_OUTLINE,
      highlight: isRouteActive({ route, routes: staffStudentTrackingFeedbacksRoutes }),
    },
  ],
}))

const homeItemId = useId()
const navItems = computed(() => [
  {
    id: homeItemId,
    to: ROUTES.STAFF.HOME,
    text: t('staff.global.navigation.tabs.home').toUpperCase(),
    icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
  },
  {
    to: ROUTES.STAFF.ACTIVITIES,
    text: t('staff.global.navigation.tabs.activities.header').toUpperCase(),
    icon: ICONS.ACTIVITY,
    highlight: isRouteActive({ route, routes: staffActivitiesRoutes }),
  },
  studentTrackingMenu.value,
])
</script>

<template>
  <AvNavigation
    :nav-items="navItems"
    data-testid="main-navigation"
  />
</template>
