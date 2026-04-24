<script setup lang="ts">
import { useGetDeclaredExperienceView } from '@/api/avenir-esr'
import { Pagination } from '@/common/components'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useBaseApiExceptionToast, useModal, usePagination } from '@/common/composables'
import DeclaredExperienceCard from '@/features/student/personalCareer/components/cards/DeclaredExperienceCard/DeclaredExperienceCard.vue'
import AddDeclaredExperienceDrawer
  from '@/features/student/personalCareer/components/overlays/AddDeclaredExperienceDrawer/AddDeclaredExperienceDrawer.vue'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import DeclaredExperiencesMoreActionsDropdown
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeclaredExperiencesMoreActionsDropdown/DeclaredExperiencesMoreActionsDropdown.vue'
import DeleteDeclaredExperiencesModal from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeleteDeclaredExperiencesModal/DeleteDeclaredExperiencesModal.vue'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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

const params = computed(() => ({
  page: currentPage.value,
  pageSize: pageSizeSelected.value
}))

const { data, error, isFetching } = useGetDeclaredExperienceView(params, { query: { placeholderData: keepPreviousData } })
const declaredExperiences = computed(() => data.value?.data || [])
const pageInfo = computed(() => data.value?.page)

const { showModal, displayModal, hideModal } = useModal()

const titleWithCount = computed(() => t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeclaredExperiencesTab.title').concat(` (${pageInfo.value?.totalElements ?? 0})`))

useBaseApiExceptionToast(error)
</script>

<template>
  <div class="av-col av-gap-md">
    <DeclaredExperiencesMoreActionsDropdown
      @delete-selected="displayModal"
      @add-selected="personalCareerStore.displayAddDeclaredExperienceDrawer"
    />
    <AvIconText
      icon-color="var(--text2)"
      typography-class="n6"
      :icon="MDI_ICONS.FLARE"
      :text="titleWithCount"
    />
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
      :show="showModal"
      @close="hideModal"
      @confirm="hideModal"
    />
    <AddDeclaredExperienceDrawer />
  </div>
</template>
