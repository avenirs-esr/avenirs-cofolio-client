<script setup lang="ts">
import type { EExperienceType } from '@/api/avenir-esr'
import type { SortValue } from '@/common/types'
import { ESortField, ESortOrder, useGetDeclaredExperienceView } from '@/api/avenir-esr'
import { Pagination, SortSelect } from '@/common/components'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useBaseApiExceptionToast, useModal, usePagination } from '@/common/composables'
import { ICONS } from '@/common/constants'
import { formatSortValue, parseSortValue } from '@/common/utils/http/http-params'
import DeclaredExperienceCard from '@/features/student/personalCareer/components/cards/DeclaredExperienceCard/DeclaredExperienceCard.vue'
import AddDeclaredExperienceDrawer
  from '@/features/student/personalCareer/components/overlays/AddDeclaredExperienceDrawer/AddDeclaredExperienceDrawer.vue'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import DeclaredExperiencesMoreActionsDropdown
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeclaredExperiencesMoreActionsDropdown/DeclaredExperiencesMoreActionsDropdown.vue'
import DeleteDeclaredExperiencesModal from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeleteDeclaredExperiencesModal/DeleteDeclaredExperiencesModal.vue'
import ExperienceTypeMultiselect from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/ExperienceTypeMultiselect/ExperienceTypeMultiselect.vue'
import { AvIconText, type AvMultiselectOption } from '@avenirs-esr/avenirs-dsav'
import { keepPreviousData } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const personalCareerStore = usePersonalCareerStore()

const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(
  toRef(personalCareerStore, 'declaredExperiencesCurrentPage'),
  toRef(personalCareerStore, 'declaredExperiencesPageSizeSelected')
)

const selectedExperienceTypes = ref<AvMultiselectOption[]>([])
const experienceTypes = computed<EExperienceType[]>(() =>
  selectedExperienceTypes.value.map(option => option.value as EExperienceType)
)

const selectedSort = ref<{ itemId: SortValue }>({ itemId: formatSortValue(ESortField.DATE, ESortOrder.DESC) })

const params = computed(() => {
  const { sortField, sortOrder } = parseSortValue(selectedSort.value.itemId)

  return {
    page: currentPage.value,
    pageSize: pageSizeSelected.value,
    experienceTypes: experienceTypes.value.length ? experienceTypes.value : undefined,
    sortField,
    sortOrder
  }
})

const { data, error, isFetching } = useGetDeclaredExperienceView(params, { query: { placeholderData: keepPreviousData } })
const declaredExperiences = computed(() => data.value?.data || [])
const pageInfo = computed(() => data.value?.page)

const { modalOpened, openModal, closeModal } = useModal()

const titleWithCount = computed(() => t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeclaredExperiencesTab.title').concat(` (${pageInfo.value?.totalElements ?? 0})`))

useBaseApiExceptionToast(error)
</script>

<template>
  <div class="av-col av-gap-md">
    <div class="av-row av-wrap av-gap-sm av-justify-between av-align-center">
      <AvIconText
        icon-color="var(--text2)"
        typography-class="n4"
        :icon="ICONS.EXPERIENCES"
        :text="titleWithCount"
      />
      <DeclaredExperiencesMoreActionsDropdown
        @delete="openModal"
        @add="personalCareerStore.displayAddDeclaredExperienceDrawer"
      />
    </div>

    <div class="av-row av-wrap av-gap-sm av-align-center">
      <ExperienceTypeMultiselect v-model="selectedExperienceTypes" />
      <SortSelect
        v-model:selected-item="selectedSort"
        data-testid="declared-experiences-sort-select"
      />
    </div>

    <QuerySuspense
      :error="error"
      :is-loading="isFetching"
      :is-empty="declaredExperiences.length === 0"
      :empty-state-message="t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeclaredExperiencesTab.emptyState')"
    >
      <Pagination
        v-if="pageInfo"
        :page-info="pageInfo"
        :page-size-selected="pageSizeSelected"
        :on-update-current-page="onUpdateCurrentPage"
        :on-update-page-size="onUpdatePageSize"
      >
        <div
          class="av-col av-gap-lg"
          data-testid="cards-layout"
        >
          <DeclaredExperienceCard
            v-for="experience in declaredExperiences"
            :key="experience.id"
            :declared-experience="experience"
          />
        </div>
      </Pagination>
    </QuerySuspense>
    <DeleteDeclaredExperiencesModal
      v-if="pageInfo"
      :opened="modalOpened"
      :total-count="pageInfo.totalElements"
      @close="closeModal"
      @confirm="closeModal"
    />
    <AddDeclaredExperienceDrawer />
  </div>
</template>
