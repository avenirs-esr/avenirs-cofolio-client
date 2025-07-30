<script lang="ts" setup>
import type { Ref } from 'vue'
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { useAmsViewQuery } from '@/features/student/queries'
import ProgramProgressSelector
  from '@/features/student/views/StudentEducationAmsView/components/ProgramProgressSelector/ProgramProgressSelector.vue'
import StudentDetailedAmsCard from '@/features/student/views/StudentEducationAmsView/components/StudentDetailedAmsCard/StudentDetailedAmsCard.vue'
import { useAmsStore } from '@/store'

const amsStore = useAmsStore()
const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(toRef(amsStore, 'currentPage'), toRef(amsStore, 'pageSizeSelected'))

const selectedProgramProgressId: Ref<string | undefined> = ref(undefined)

const { amss, pageInfo, error } = useAmsViewQuery(selectedProgramProgressId, currentPage, pageSizeSelected)
useBaseApiExceptionToast(error)
</script>

<template>
  <div class="ams-list-container">
    <ProgramProgressSelector
      v-model="selectedProgramProgressId"
    />
    <Pagination
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <div class="detailed-cards-container">
        <StudentDetailedAmsCard
          v-for="ams in amss"
          :key="ams.id"
          :ams="ams"
        />
      </div>
    </Pagination>
  </div>
</template>

<style lang="scss" scoped>
.ams-list-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--spacing-lg);
}

.detailed-cards-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.25rem;
}
</style>
