<script setup lang="ts">
import type { EExperienceType } from '@/api/avenir-esr'
import { useGetDeclaredExperienceView } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import ValorizedElementsCardContainer from '@/features/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.vue'
import ValorizedDeclaredExperienceItem from '@/features/kit/views/StudentToolsKitView/components/ValorizedDeclaredExperienceItem/ValorizedDeclaredExperienceItem.vue'
import { useI18n } from 'vue-i18n'

export interface ValorizedDeclaredExperiencesContainerProps {
  experienceType: EExperienceType
}

const { experienceType } = defineProps<ValorizedDeclaredExperiencesContainerProps>()

const { t } = useI18n()

const { data, error, isFetching } = useGetDeclaredExperienceView(
  { isValorized: true, pageSize: 100 }
)

const declaredExperiences = computed(() => (data.value?.data ?? []).filter(
  declaredExperience => declaredExperience.experienceType === experienceType
))
const totalElements = computed(() => declaredExperiences.value.length)
const isEmpty = computed(() => totalElements.value === 0)
const declaredExperiencesRoute = { name: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name }
const emptyStateMessage = computed(() => t(
  'student.kit.cards.ValorizedElementsCardContainer.emptyState',
  { item: t('student.kit.views.StudentToolsKitView.valorizedDeclaredExperiencesContainer.emptyStateItemLabel') }
))
const title = computed(() => t(
  `student.kit.views.StudentToolsKitView.valorizedDeclaredExperiencesContainer.${experienceType}.title`,
  { count: totalElements.value }
))
const seeAllLabel = computed(() => t(
  `student.kit.views.StudentToolsKitView.valorizedDeclaredExperiencesContainer.${experienceType}.seeAll`
))
const dataTestid = computed(() => `valorized-${experienceType.toLowerCase()}-experiences-container`)
</script>

<template>
  <ValorizedElementsCardContainer
    :title="title"
    :error="error"
    :is-loading="isFetching"
    :is-empty="isEmpty"
    :empty-state-message="emptyStateMessage"
    :see-all-label="seeAllLabel"
    :see-all-to="declaredExperiencesRoute"
    :data-testid="dataTestid"
    collapsed
  >
    <ValorizedDeclaredExperienceItem
      v-for="declaredExperience in declaredExperiences"
      :key="declaredExperience.id"
      :declared-experience="declaredExperience"
    />
  </ValorizedElementsCardContainer>
</template>
