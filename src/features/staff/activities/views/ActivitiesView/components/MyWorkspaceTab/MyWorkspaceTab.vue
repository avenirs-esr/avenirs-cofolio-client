<script lang="ts" setup>
import { useGetStaffActivityWorkingSpace } from '@/api/avenir-esr'
import { useStaffActivitiesStore } from '@/features/staff/activities/stores/activities.store'
import ActivitiesTab from '@/features/staff/activities/views/ActivitiesView/components/ActivitiesTab/ActivitiesTab.vue'
import ActivityDraftCreationModal from '@/features/staff/activities/views/ActivitiesView/components/ActivityDraftCreationModal/ActivityDraftCreationModal.vue'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const staffActivitiesStore = useStaffActivitiesStore()

const totalActivities = ref(0)

const usePaginatedStaffActivitiesParams = {
  currentPageRef: toRef(staffActivitiesStore, 'workingSpaceCurrentPage'),
  pageSizeRef: toRef(staffActivitiesStore, 'workingSpacePageSizeSelected'),
  fetchFn: useGetStaffActivityWorkingSpace,
}
</script>

<template>
  <ActivitiesTab
    :title="t('staff.activities.views.ActivitiesView.MyWorkspaceTab.title', { count: totalActivities })"
    :empty-state-message="t('staff.activities.views.ActivitiesView.MyWorkspaceTab.emptyState')"
    :use-paginated-staff-activities-params="usePaginatedStaffActivitiesParams"
    with-status
    with-actions
    @update-activities-count="totalActivities = $event"
  >
    <template #actions>
      <div class="av-row av-justify-end av-py-md">
        <AvButton
          :label="t('staff.activities.views.ActivitiesView.MyWorkspaceTab.createActivity')"
          variant="FLAT"
          :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
          theme="PRIMARY"
          data-testid="create-activity-button"
          @click="staffActivitiesStore.displayAddActivityModal"
        />
      </div>
    </template>
  </ActivitiesTab>

  <ActivityDraftCreationModal
    :opened="staffActivitiesStore.showAddActivityModal"
    @close="staffActivitiesStore.hideAddActivityModal"
  />
</template>
