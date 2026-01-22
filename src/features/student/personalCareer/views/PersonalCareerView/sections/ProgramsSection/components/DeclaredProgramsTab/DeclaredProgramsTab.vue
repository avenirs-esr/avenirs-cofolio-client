<script setup lang="ts">
import { Loader, Pagination } from '@/common/components'
import { useBaseApiExceptionToast, useModal, usePagination } from '@/common/composables'
import { AddDeclaredProgramDrawer } from '@/features/student/personalCareer'
import DeclaredProgramCard from '@/features/student/personalCareer/components/cards/DeclaredProgramCard/DeclaredProgramCard.vue'
import { useDeclaredProgramsViewQuery } from '@/features/student/personalCareer/queries/use-declared-programs.query'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import DeclaredProgramsMoreActionsDropdown
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/DeclaredProgramsMoreActionsDropdown/DeclaredProgramsMoreActionsDropdown.vue'
import DeleteDeclaredProgramsModal from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/DeleteDeclaredProgramsModal/DeleteDeclaredProgramsModal.vue'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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

const { declaredPrograms, pageInfo, error, isFetching, isError } = useDeclaredProgramsViewQuery({
  page: currentPage,
  pageSize: pageSizeSelected
})

const { showModal, displayModal, hideModal } = useModal()

const countDeclaredPrograms = computed(() => pageInfo.value.totalElements)
const titleWithCount = computed(() => t('student.personalCareer.views.PersonalCareerView.ProgramsSection.DeclaredProgramsTab.title').concat(` (${countDeclaredPrograms.value})`))

const shouldShowEmptyState = computed(() => !isFetching.value && declaredPrograms.value.length === 0 && !isError.value)

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
    <div
      v-if="shouldShowEmptyState"
      class="av-row av-justify-center av-my-md"
    >
      <span class="s2-regular">
        {{ t('student.personalCareer.views.PersonalCareerView.ProgramsSection.DeclaredProgramsTab.emptyState') }}
      </span>
    </div>
    <Pagination
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <div>
        <Loader
          :is-loading="isFetching && !isError"
          size="2xl"
        >
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
        </Loader>
      </div>
    </Pagination>
    <AddDeclaredProgramDrawer />
    <DeleteDeclaredProgramsModal
      :show="showModal"
      @close="hideModal"
      @confirm="hideModal"
    />
  </div>
</template>
