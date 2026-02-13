<script lang="ts" setup>
import type { PageInfoDTO } from '@/api/avenir-esr'
import Pagination from '@/common/components/Pagination/Pagination.vue'
import { usePagination } from '@/common/composables'
import { useProjectActivitiesStore } from '@/features/student/buildProject/stores/activities.store'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const activitiesStore = useProjectActivitiesStore()

const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(toRef(activitiesStore, 'currentPage'), toRef(activitiesStore, 'pageSizeSelected'))

const pageInfo = ref<PageInfoDTO>({
  page: currentPage.value,
  pageSize: pageSizeSelected.value,
  totalElements: 8,
  totalPages: 2
}) // TODO US #959 - get paginated data from back
</script>

<template>
  <div class="av-col av-gap-xl">
    <AvIconText
      :icon="MDI_ICONS.STOREFRONT_OUTLINE"
      icon-color="var(--icon)"
      :text="t('student.buildProject.views.projectActivitiesView.allActivitiesTab.allActivitiesPaginatorCard.title', { count: pageInfo.totalElements })"
      text-color="var(--text1)"
      typography-class="n5"
    />
    <Pagination
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      Placeholder...
    </Pagination>
  </div>
</template>
