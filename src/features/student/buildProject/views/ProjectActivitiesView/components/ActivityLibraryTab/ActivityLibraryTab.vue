<script setup lang="ts">
import EmptyState from '@/common/components/feedback/EmptyState/EmptyState.vue'
import Loader from '@/common/components/Loader/Loader.vue'
import Pagination from '@/common/components/Pagination/Pagination.vue'
import { useModal, usePagination } from '@/common/composables'
import ActivityErrorMessage from '@/features/student/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.vue'
import { useLibraryActivitiesQuery } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import { useProjectActivitiesStore } from '@/features/student/buildProject/stores/activities.store'
import ActivityLibraryCard from '@/features/student/buildProject/views/ProjectActivitiesView/components/ActivityLibraryCard/ActivityLibraryCard.vue'
import ActivityLibraryDropdown from '@/features/student/buildProject/views/ProjectActivitiesView/components/overlays/ActivityLibraryDropdown/ActivityLibraryDropdown.vue'
import UnsubscribeActivitiesModal from '@/features/student/buildProject/views/ProjectActivitiesView/components/overlays/UnsubscribeActivitiesModal/UnsubscribeActivitiesModal.vue'
import { AvIconText, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activitiesStore = useProjectActivitiesStore()

const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(toRef(activitiesStore, 'currentPage'), toRef(activitiesStore, 'pageSizeSelected'))

const params = computed(() => ({
  page: currentPage.value,
  pageSize: pageSizeSelected.value,
}))

const { libraryActivities, pageInfo, isLoading, isError, error } = useLibraryActivitiesQuery(params)
const { showModal, displayModal, hideModal } = useModal()

const shouldShowEmptyState = computed(() => !isLoading.value && libraryActivities.value?.length === 0 && !isError.value)
</script>

<template>
  <div
    class="av-col av-gap-xl av-pt-md"
    data-testid="activity-library-tab"
  >
    <ActivityErrorMessage :error />

    <Loader
      :is-loading="isLoading && !isError"
      size="2xl"
    >
      <div class="av-col av-gap-md">
        <div class="av-row av-justify-end">
          <ActivityLibraryDropdown @unsubscribe-selected="displayModal" />
        </div>

        <AvIconText
          :icon="RI_ICONS.BOOK_SHELF_LINE"
          icon-color="var(--text2)"
          :text="t('student.buildProject.views.projectActivitiesView.ActivityLibraryTab.tabTitle', { count: pageInfo?.totalElements ?? 0 })"
          text-color="var(--text1)"
          typography-class="n5"
          data-testid="activity-library-tab-title"
        />

        <EmptyState
          v-if="shouldShowEmptyState"
          :title="t('student.buildProject.views.projectActivitiesView.ActivityLibraryTab.emptyState')"
          data-testid="activity-library-empty-state"
        />

        <Pagination
          v-else-if="pageInfo && !shouldShowEmptyState"
          :page-info="pageInfo"
          :page-size-selected="pageSizeSelected"
          without-page-size-picker
          :on-update-current-page="onUpdateCurrentPage"
          :on-update-page-size="onUpdatePageSize"
        >
          <div
            class="av-col av-gap-md"
            data-testid="activity-library-card-list"
          >
            <ActivityLibraryCard
              v-for="activity in libraryActivities"
              :key="activity.id"
              :activity="activity"
            />
          </div>
        </Pagination>
      </div>
    </Loader>
  </div>

  <UnsubscribeActivitiesModal
    :show="showModal"
    @cancel="hideModal"
    @unsubscribed="hideModal"
  />
</template>
