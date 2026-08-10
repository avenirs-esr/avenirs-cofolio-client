<script lang="ts" setup>
import { useGetStaffActivityLibrary } from '@/api/avenir-esr'
import { useStaffActivitiesStore } from '@/features/staff/activities/stores/activities.store'
import ActivitiesTab from '@/features/staff/activities/views/ActivitiesView/components/ActivitiesTab/ActivitiesTab.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const staffActivitiesStore = useStaffActivitiesStore()

const totalActivities = ref(0)

const usePaginatedStaffActivitiesParams = {
  currentPageRef: toRef(staffActivitiesStore, 'allActivitiesCurrentPage'),
  pageSizeRef: toRef(staffActivitiesStore, 'allActivitiesPageSizeSelected'),
  fetchFn: useGetStaffActivityLibrary,
}
</script>

<template>
  <ActivitiesTab
    data-testid="all-published-activities-tab-content"
    :title="t('staff.activities.views.ActivitiesView.StaffAllActivitiesTab.title', { count: totalActivities })"
    :empty-state-message="t('staff.activities.views.ActivitiesView.StaffAllActivitiesTab.emptyState')"
    :use-paginated-staff-activities-params="usePaginatedStaffActivitiesParams"
    with-actions
    @update-activities-count="totalActivities = $event"
  />
</template>
