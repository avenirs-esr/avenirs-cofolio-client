<script setup lang="ts">
import { useGetDeclaredPrograms } from '@/api/avenir-esr'
import { Pagination } from '@/common/components'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useBaseApiExceptionToast, useModal, usePagination } from '@/common/composables'
import { AddDeclaredProgramDrawer } from '@/features/personalCareer'
import DeclaredProgramCard from '@/features/personalCareer/components/cards/DeclaredProgramCard/DeclaredProgramCard.vue'
import { usePersonalCareerStore } from '@/features/personalCareer/stores/personalCareer.store'
import DeclaredProgramsMoreActionsDropdown
  from '@/features/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/DeclaredProgramsMoreActionsDropdown/DeclaredProgramsMoreActionsDropdown.vue'
import DeleteDeclaredProgramsModal from '@/features/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/DeleteDeclaredProgramsModal/DeleteDeclaredProgramsModal.vue'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { keepPreviousData } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const personalCareerStore = usePersonalCareerStore()
const { displayAddDeclaredProgramDrawer } = personalCareerStore

const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(
  toRef(personalCareerStore, 'declaredProgramsCurrentPage'),
  toRef(personalCareerStore, 'declaredProgramsPageSizeSelected')
)

const params = computed(() => ({
  page: currentPage.value,
  pageSize: pageSizeSelected.value
}))

const { data, error, isFetching } = useGetDeclaredPrograms(params, { query: { placeholderData: keepPreviousData } })
const declaredPrograms = computed(() => data.value?.data ?? [])
const pageInfo = computed(() => data.value?.page)

const { showModal, displayModal, hideModal } = useModal()

const titleWithCount = computed(() => t('student.personalCareer.views.PersonalCareerView.ProgramsSection.DeclaredProgramsTab.title').concat(` (${pageInfo.value?.totalElements ?? 0})`))

useBaseApiExceptionToast(error)
</script>

<template>
  <div class="av-col av-gap-md">
    <div class="av-row av-justify-end">
      <DeclaredProgramsMoreActionsDropdown
        @add-selected="displayAddDeclaredProgramDrawer"
        @delete-selected="displayModal"
      />
    </div>
    <AvIconText
      icon-color="var(--text2)"
      typography-class="n6"
      :icon="MDI_ICONS.FLARE"
      :text="titleWithCount"
    />
    <QuerySuspense
      :error="error"
      :is-empty="declaredPrograms.length === 0"
      :is-loading="isFetching"
      :empty-state-message="t('student.personalCareer.views.PersonalCareerView.ProgramsSection.DeclaredProgramsTab.emptyState')"
    >
      <Pagination
        v-if="pageInfo"
        :page-info="pageInfo"
        :page-size-selected="pageSizeSelected"
        :on-update-current-page="onUpdateCurrentPage"
        :on-update-page-size="onUpdatePageSize"
      >
        <div>
          <div
            class="av-col av-gap-lg"
            data-testid="cards-layout"
          >
            <DeclaredProgramCard
              v-for="program in declaredPrograms"
              :key="program.id"
              :declared-program="program"
            />
          </div>
        </div>
      </Pagination>
    </QuerySuspense>
    <AddDeclaredProgramDrawer />
    <DeleteDeclaredProgramsModal
      v-if="pageInfo"
      :show="showModal"
      :total-count="pageInfo.totalElements"
      @close="hideModal"
      @confirm="hideModal"
    />
  </div>
</template>
