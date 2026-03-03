<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import {
  useCountActivitiesQuery,
  useCountLibraryActivities
} from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import { useProjectActivitiesStore } from '@/features/student/buildProject/stores/activities.store'
import ActivityLibraryTab from '@/features/student/buildProject/views/ProjectActivitiesView/components/ActivityLibraryTab/ActivityLibraryTab.vue'
import AllActivitiesTab from '@/features/student/buildProject/views/ProjectActivitiesView/components/AllActivitiesTab/AllActivitiesTab.vue'
import { AvTab, AvTabs, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeTab = ref(0)

const activitiesStore = useProjectActivitiesStore()

const params = computed(() => ({
  page: activitiesStore.libraryCurrentPage,
  pageSize: activitiesStore.libraryPageSizeSelected,
}))

const { data: libraryTotalElements } = useCountLibraryActivities(params)
const { data: activityTotalElements } = useCountActivitiesQuery()

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
  <AvTabs v-model="activeTab">
    <AvTab
      :title="t('student.buildProject.views.projectActivitiesView.allActivitiesTab.tabTitle', { count: activityTotalElements })"
      :icon="MDI_ICONS.STOREFRONT_OUTLINE"
    >
      <AllActivitiesTab />
    </AvTab>
    <AvTab
      :title="t('student.buildProject.views.projectActivitiesView.ActivityLibraryTab.tabTitle', { count: libraryTotalElements })"
      :icon="RI_ICONS.BOOK_SHELF_LINE"
    >
      <ActivityLibraryTab />
    </AvTab>
  </AvTabs>
</template>
