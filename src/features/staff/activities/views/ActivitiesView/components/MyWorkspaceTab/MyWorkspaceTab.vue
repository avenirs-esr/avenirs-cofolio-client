<script lang="ts" setup>
import { invalidateGetStaffActivityWorkingSpace, useDeleteActivityDraft, useGetStaffActivityWorkingSpace } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useStaffActivitiesStore } from '@/features/staff/activities/stores/activities.store'
import ActivitiesTab from '@/features/staff/activities/views/ActivitiesView/components/ActivitiesTab/ActivitiesTab.vue'
import ActivityDraftCreationModal from '@/features/staff/activities/views/ActivitiesView/components/ActivityDraftCreationModal/ActivityDraftCreationModal.vue'
import { useToasterStore } from '@/store'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const staffActivitiesStore = useStaffActivitiesStore()
const queryClient = useQueryClient()
const { mutate: deleteActivityDraft } = useDeleteActivityDraft()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { getErrorMessage } = useApiErrors()

const totalActivities = ref(0)

const usePaginatedStaffActivitiesParams = {
  currentPageRef: toRef(staffActivitiesStore, 'workingSpaceCurrentPage'),
  pageSizeRef: toRef(staffActivitiesStore, 'workingSpacePageSizeSelected'),
  fetchFn: useGetStaffActivityWorkingSpace,
}

function handleDeleteDraftActivity (activityId: string) {
  deleteActivityDraft({ activityDraftId: activityId }, {
    onSuccess: () => {
      addSuccessMessage(t('staff.activities.views.ActivitiesView.MoreActionsDropdown.deleteSuccess'))
      invalidateGetStaffActivityWorkingSpace(queryClient)
    },
    onError: (error) => {
      addErrorMessage({ title: t('staff.activities.views.ActivitiesView.MoreActionsDropdown.deleteError'), description: getErrorMessage(error) })
    },
  })
}
</script>

<template>
  <ActivitiesTab
    :title="t('staff.activities.views.ActivitiesView.MyWorkspaceTab.title', { count: totalActivities })"
    :empty-state-message="t('staff.activities.views.ActivitiesView.MyWorkspaceTab.emptyState')"
    :use-paginated-staff-activities-params="usePaginatedStaffActivitiesParams"
    with-status
    with-actions-column
    @update-activities-count="totalActivities = $event"
    @delete-draft-activity="handleDeleteDraftActivity"
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
