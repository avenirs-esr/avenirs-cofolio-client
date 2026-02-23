<script setup lang="ts">
import Loader from '@/common/components/Loader/Loader.vue'
import ActivityErrorMessage from '@/features/student/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.vue'
import { useLibraryActivitiesQuery } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import { useProjectActivitiesStore } from '@/features/student/buildProject/stores/activities.store'
import ActivityLibraryCard from '@/features/student/buildProject/views/ProjectActivitiesView/components/ActivityLibraryCard/ActivityLibraryCard.vue'
import { AvIconText, AvPagination, getPaginationPages, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activitiesStore = useProjectActivitiesStore()

const params = computed(() => ({
  page: activitiesStore.libraryCurrentPage,
  pageSize: activitiesStore.libraryPageSizeSelected,
}))

const { libraryActivities, pageInfo, isLoading, isError, error } = useLibraryActivitiesQuery(params)

const totalPages = computed(() => pageInfo.value?.totalPages ?? 0)
const pages = computed(() => getPaginationPages(totalPages))
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="activity-library-tab"
  >
    <AvIconText
      :icon="RI_ICONS.BOOK_SHELF_LINE"
      icon-color="var(--text2)"
      :text="t('student.buildProject.views.projectActivitiesView.ActivityLibraryTab.tabTitle', { count: pageInfo?.totalElements ?? 0 })"
      text-color="var(--text1)"
      typography-class="n5"
      data-testid="activity-library-tab-title"
    />

    <ActivityErrorMessage :error />

    <Loader
      :is-loading="isLoading && !isError"
      size="2xl"
    >
      <div class="av-col av-gap-sm">
        <AvPagination
          :aria-label="t('student.buildProject.views.projectActivitiesView.ActivityLibraryTab.pagination.ariaLabel')"
          :current-page="pageInfo?.page ?? 0"
          :pages="pages"
          class="av-row av-justify-end"
          data-testid="activity-library-tab-pagination"
          compact
          :prev-page-label="t('global.avPagination.prevPageTitle')"
          :next-page-label="t('global.avPagination.nextPageTitle')"
          :compact-current-page-label="t('global.avPagination.current', {
            current: (pageInfo?.page ?? 0) + 1,
            total: totalPages,
          })"
          @update:current-page="(page) => activitiesStore.libraryCurrentPage = page"
        />

        <ActivityLibraryCard
          v-for="activity in libraryActivities"
          :key="activity.id"
          :activity="activity"
        />
      </div>
    </Loader>
  </div>
</template>
