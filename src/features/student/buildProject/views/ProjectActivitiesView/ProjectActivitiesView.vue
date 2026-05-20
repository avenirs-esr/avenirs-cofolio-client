<script setup lang="ts">
import { useGetActivitiesView, useGetDeclaredActivitiesView } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { ROUTES } from '@/common/constants'
import { useProjectActivitiesStore } from '@/features/student/buildProject/stores/activities.store'
import ActivityLibraryTab from '@/features/student/buildProject/views/ProjectActivitiesView/components/ActivityLibraryTab/ActivityLibraryTab.vue'
import AllActivitiesTab from '@/features/student/buildProject/views/ProjectActivitiesView/components/AllActivitiesTab/AllActivitiesTab.vue'
import { AvTab, AvTabs, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

enum ProjectActivitiesTab {
  ALL_ACTIVITIES = 0,
  ACTIVITY_LIBRARY = 1,
}

const activeTab = useEnumRouteQuery('tab', ProjectActivitiesTab, ProjectActivitiesTab.ALL_ACTIVITIES)

const activitiesStore = useProjectActivitiesStore()

const params = computed(() => ({
  page: activitiesStore.libraryCurrentPage,
  pageSize: activitiesStore.libraryPageSizeSelected,
}))

const countActivitiesParams = computed(() => ({
  page: 0,
  pageSize: 1,
}))

const { data: dataDeclaredActivities } = useGetDeclaredActivitiesView(params)
const { data } = useGetActivitiesView(countActivitiesParams)
const activityTotalElements = computed(() => data.value?.page.totalElements ?? 0)
const libraryTotalElements = computed(() => dataDeclaredActivities.value?.page.totalElements ?? 0)

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.activities') }
])
</script>

<template>
  <PageTitle
    :title="t('student.buildProject.views.projectActivitiesView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.HOME"
  />
  <AvTabs
    v-model="activeTab"
    data-testid="project-activities-tabs"
  >
    <AvTab
      :title="t('student.buildProject.views.projectActivitiesView.allActivitiesTab.tabTitle', { count: activityTotalElements })"
      :icon="MDI_ICONS.STOREFRONT_OUTLINE"
      data-testid="all-activities-tab-item"
    >
      <AllActivitiesTab />
    </AvTab>
    <AvTab
      :title="t('student.buildProject.views.projectActivitiesView.ActivityLibraryTab.tabTitle', { count: libraryTotalElements })"
      :icon="RI_ICONS.BOOK_SHELF_LINE"
      data-testid="activity-library-tab-item"
    >
      <ActivityLibraryTab />
    </AvTab>
  </AvTabs>
</template>
