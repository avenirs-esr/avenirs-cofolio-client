<script lang="ts" setup>
import { AmsPageSizePicker } from '@/common/components'
import { useBaseApiExceptionToast } from '@/common/composables'
import { useAmsViewQuery } from '@/features/student/queries'
import StudentDetailedAmsCard from '@/features/student/views/StudentEducationAmsView/components/StudentDetailedAmsCard/StudentDetailedAmsCard.vue'
import { useAmsStore } from '@/store'
import { AvPagination, getPaginationPages } from '@/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const amsStore = useAmsStore()
const currentPage = toRef(amsStore, 'currentPage')
const pageSizeSelected = toRef(amsStore, 'pageSizeSelected')
const { amss, pageInfo, error } = useAmsViewQuery(currentPage, pageSizeSelected)
useBaseApiExceptionToast(error)

const totalPages = computed(() => pageInfo.value?.totalPages)
const pages = computed(() => getPaginationPages(totalPages))

function onUpdateCurrentPage (pageNumber: number) {
  currentPage.value = pageNumber
}

watch(pageSizeSelected, () => {
  currentPage.value = 0
}, { immediate: true })
</script>

<template>
  <div class="student-education-ams-view-container">
    <div class="top-pagination-container">
      <AmsPageSizePicker />
      <AvPagination
        id="top-pagination"
        :current-page="pageInfo.number"
        :pages="pages"
        :aria-label="t('student.views.studentToolsTracesView.studentToolsTracesViewContainer.pagination.top.ariaLabel')"
        compact
        @update:current-page="onUpdateCurrentPage"
      />
    </div>
    <div class="detailed-cards-container">
      <StudentDetailedAmsCard
        v-for="ams in amss"
        :key="ams.id"
        :ams="ams"
      />
    </div>
    <div class="bottom-pagination-container">
      <AvPagination
        id="bottom-pagination"
        :items="amss"
        :current-page="pageInfo.number"
        :pages="pages"
        :aria-label="t('student.views.studentToolsTracesView.studentToolsTracesViewContainer.pagination.bottom.ariaLabel')"
        @update:current-page="onUpdateCurrentPage"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.student-education-ams-view-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
}

.top-pagination-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.detailed-cards-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.25rem;
}

.bottom-pagination-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  padding-bottom: 2rem;
}
</style>
