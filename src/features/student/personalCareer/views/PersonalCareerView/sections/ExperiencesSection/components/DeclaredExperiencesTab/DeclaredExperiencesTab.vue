<script setup lang="ts">
import { Loader, Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import DeclaredExperienceCard from '@/features/student/personalCareer/components/cards/DeclaredExperienceCard/DeclaredExperienceCard.vue'
import { useDeclaredExperiencesViewQuery } from '@/features/student/personalCareer/queries/use-declared-experiences.query'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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

const { declaredExperiences, pageInfo, error, isFetching, isError } = useDeclaredExperiencesViewQuery({
  page: currentPage,
  pageSize: pageSizeSelected
})

const titleWithCount = computed(() => t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeclaredExperiencesTab.title').concat(` (${pageInfo.value.totalElements})`))

const shouldShowEmptyState = computed(() => !isFetching.value && declaredExperiences.value.length === 0 && !isError.value)

useBaseApiExceptionToast(error)
</script>

<template>
  <div class="av-col av-gap-md">
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
        {{ t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeclaredExperiencesTab.emptyState') }}
      </span>
    </div>
    <Pagination
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <Loader
        :is-loading="isFetching && !isError"
        size="2xl"
      >
        <DeclaredExperienceCard
          v-for="experience in declaredExperiences"
          :key="experience.id"
          class="av-col av-gap-lg av-py-md"
          :declared-experience="experience"
        />
      </Loader>
    </Pagination>
  </div>
</template>
