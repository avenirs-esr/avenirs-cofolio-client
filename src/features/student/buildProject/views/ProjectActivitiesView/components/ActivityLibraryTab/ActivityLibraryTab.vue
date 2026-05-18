<script setup lang="ts">
import { useGetDeclaredActivitiesView } from '@/api/avenir-esr'
import Pagination from '@/common/components/Pagination/Pagination.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useModal, usePagination } from '@/common/composables'
import ActivityErrorMessage from '@/features/student/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.vue'
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

const { data, isLoading, error } = useGetDeclaredActivitiesView(params)
const { showModal, displayModal, hideModal } = useModal()

const libraryActivities = computed(() => data.value?.data || [])
const pageInfo = computed(() => data.value?.page)
</script>

<template>
  <div
    class="av-col av-gap-xl av-pt-md"
    data-testid="activity-library-tab"
  >
    <div class="av-col av-gap-md">
      <div class="av-row av-justify-end">
        <ActivityLibraryDropdown
          :unsubscribe-disabled="libraryActivities.length === 0"
          @unsubscribe-selected="displayModal"
        />
      </div>

      <AvIconText
        :icon="RI_ICONS.BOOK_SHELF_LINE"
        icon-color="var(--text2)"
        :text="t('student.buildProject.views.projectActivitiesView.ActivityLibraryTab.tabTitle', { count: pageInfo?.totalElements ?? 0 })"
        text-color="var(--text1)"
        typography-class="n5"
        data-testid="activity-library-tab-title"
      />

      <QuerySuspense
        :error="error"
        :is-loading="isLoading"
        :is-empty="libraryActivities.length === 0"
        :empty-state-message="t('student.buildProject.views.projectActivitiesView.ActivityLibraryTab.emptyState')"
      >
        <template #error>
          <ActivityErrorMessage :error="error" />
        </template>

        <Pagination
          v-if="pageInfo"
          :page-info="pageInfo"
          :page-size-selected="pageSizeSelected"
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
      </QuerySuspense>
    </div>
  </div>

  <UnsubscribeActivitiesModal
    v-if="pageInfo"
    :show="showModal"
    :total-count="pageInfo.totalElements"
    @cancel="hideModal"
    @unsubscribed="hideModal"
  />
</template>
