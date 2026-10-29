<script setup lang="ts">
import type { GetDeclaredActivitiesViewParams } from '@/api/avenir-esr'
import type { DeclaredActivityFilters } from '@/features/student/activities/types/declared-activities.types'
import { AvIconText, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { keepPreviousData } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { useGetDeclaredActivitiesView } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import Pagination from '@/common/components/navigation/Pagination/Pagination.vue'
import { useModal, usePagination } from '@/common/composables'
import ActivityErrorMessage from '@/features/student/activities/components/errors/ActivityErrorMessage/ActivityErrorMessage.vue'
import { useActivitiesStore } from '@/features/student/activities/stores/activities.store'
import ActivityLibraryCard from '@/features/student/activities/views/ActivitiesView/components/ActivityLibraryCard/ActivityLibraryCard.vue'
import ActivityLibraryFilters from '@/features/student/activities/views/ActivitiesView/components/ActivityLibraryFilters/ActivityLibraryFilters.vue'
import ActivityLibraryDropdown from '@/features/student/activities/views/ActivitiesView/components/overlays/ActivityLibraryDropdown/ActivityLibraryDropdown.vue'
import UnsubscribeActivitiesModal from '@/features/student/activities/views/ActivitiesView/components/overlays/UnsubscribeActivitiesModal/UnsubscribeActivitiesModal.vue'

const { t } = useI18n()
const { modalOpened, openModal, closeModal } = useModal()
const activitiesStore = useActivitiesStore()
const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize,
  resetCurrentPage,
} = usePagination(toRef(activitiesStore, 'currentPage'), toRef(activitiesStore, 'pageSizeSelected'))

const filters = ref<DeclaredActivityFilters>({})

const params = computed<GetDeclaredActivitiesViewParams>(() => ({
  ...filters.value,
  page: currentPage.value,
  pageSize: pageSizeSelected.value,
}))

const { data, isLoading, error } = useGetDeclaredActivitiesView(params, {
  query: {
    placeholderData: keepPreviousData,
  },
})

const libraryActivities = computed(() => data.value?.data || [])
const pageInfo = computed(() => data.value?.page)
const hasActiveFilters = computed(() => Boolean(filters.value.keyword || filters.value.thematics || filters.value.statuses))

function onUpdateFilters (newFilters: DeclaredActivityFilters) {
  filters.value = newFilters
  resetCurrentPage()
}
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
          @unsubscribe="openModal"
        />
      </div>

      <AvIconText
        :icon="RI_ICONS.BOOK_SHELF_LINE"
        icon-color="var(--text2)"
        :text="t('student.activities.views.ActivitiesView.ActivityLibraryTab.tabTitle', { count: pageInfo?.totalElements ?? 0 })"
        text-color="var(--text1)"
        typography-class="n5"
        data-testid="activity-library-tab-title"
      />

      <ActivityLibraryFilters @update:filters="onUpdateFilters" />

      <QuerySuspense
        :error="error"
        :is-loading="isLoading"
        :is-empty="libraryActivities.length === 0"
        :empty-state-message="hasActiveFilters
          ? t('global.information.noResults')
          : t('student.activities.views.ActivitiesView.ActivityLibraryTab.emptyState')"
        preserve-content
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
    :opened="modalOpened"
    :total-count="pageInfo.totalElements"
    @cancel="closeModal"
    @unsubscribed="closeModal"
  />
</template>
