<script setup lang="ts">
import { useGetActivitiesView, useGetDeclaredActivitiesView } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { useActivitiesStore } from '@/features/student/activities/stores/activities.store'
import ActivityLibraryTab from '@/features/student/activities/views/ActivitiesView/components/ActivityLibraryTab/ActivityLibraryTab.vue'
import AllActivitiesTab from '@/features/student/activities/views/ActivitiesView/components/AllActivitiesTab/AllActivitiesTab.vue'
import { ActivitiesTab } from '@/features/student/global/types/activities.types'
import { AvTab, AvTabs, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeTab = useEnumRouteQuery('tab', ActivitiesTab, ActivitiesTab.ALL_ACTIVITIES)

const activitiesStore = useActivitiesStore()

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
</script>

<template>
  <PageTitle :title="t('student.activities.views.ActivitiesView.title')" />
  <AvTabs
    v-model="activeTab"
    data-testid="activities-tabs"
  >
    <AvTab
      :title="t('student.activities.views.ActivitiesView.AllActivitiesTab.tabTitle', { count: activityTotalElements })"
      :icon="MDI_ICONS.STOREFRONT_OUTLINE"
      data-testid="all-activities-tab-item"
    >
      <AllActivitiesTab />
    </AvTab>
    <AvTab
      :title="t('student.activities.views.ActivitiesView.ActivityLibraryTab.tabTitle', { count: libraryTotalElements })"
      :icon="RI_ICONS.BOOK_SHELF_LINE"
      data-testid="activity-library-tab-item"
    >
      <ActivityLibraryTab />
    </AvTab>
  </AvTabs>
</template>
