<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { ROUTES } from '@/common/constants'
import MyWorkspaceTab from '@/features/staff/activities/views/ActivitiesView/components/MyWorkspaceTab/MyWorkspaceTab.vue'
import StaffAllActivitiesTab from '@/features/staff/activities/views/ActivitiesView/components/StaffAllActivitiesTab/StaffAllActivitiesTab.vue'
import { AvTab, AvTabs, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.activities.header') }
])

enum ActivitiesViewTab {
  MY_WORKSPACE = 0,
  ALL_ACTIVITIES = 1,
}

const activeTab = useEnumRouteQuery('tab', ActivitiesViewTab, ActivitiesViewTab.MY_WORKSPACE)
</script>

<template>
  <PageTitle
    :title="t('staff.global.views.ActivitiesView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STAFF.HOME"
  />
  <AvTabs v-model="activeTab">
    <AvTab
      data-testid="my-workspace-tab"
      :title="t('staff.activities.views.ActivitiesView.tabs.MyWorkspaceTab')"
      :icon="RI_ICONS.BOOK_SHELF_LINE"
    >
      <MyWorkspaceTab />
    </AvTab>
    <AvTab
      data-testid="all-published-activities-tab"
      :title="t('staff.activities.views.ActivitiesView.tabs.StaffAllActivitiesTab')"
      :icon="MDI_ICONS.STOREFRONT_OUTLINE"
    >
      <StaffAllActivitiesTab />
    </AvTab>
  </AvTabs>
</template>
