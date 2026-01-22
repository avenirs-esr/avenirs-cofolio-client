<script lang="ts" setup>
import type { Ref } from 'vue'
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { useAmsViewQuery } from '@/features/student/ams/queries/use-ams-view.query/use-ams-view.query'
import { useAmsStore } from '@/features/student/ams/stores/ams.store'
import ProgramProgressSelector
  from '@/features/student/ams/views/StudentEducationAmsView/components/ProgramProgressSelector/ProgramProgressSelector.vue'
import StudentDetailedAmsCard from '@/features/student/ams/views/StudentEducationAmsView/components/StudentDetailedAmsCard/StudentDetailedAmsCard.vue'

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
  <div class="ams-list-container av-col av-gap-lg av-w-full">
    <ProgramProgressSelector
      v-model="selectedProgramProgressId"
    />
    <Pagination
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <div class="av-col av-w-full av-gap-sm">
        <StudentDetailedAmsCard
          v-for="ams in amss"
          :key="ams.id"
          :ams="ams"
        />
      </div>
    </Pagination>
  </div>
</template>
