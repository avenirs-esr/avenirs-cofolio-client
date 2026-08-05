<script setup lang="ts">
import { EExperienceType, useGetDeclaredExperienceView } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import ValorizedElementsCardContainer from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.vue'
import ValorizedDeclaredExperienceItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredExperienceItem/ValorizedDeclaredExperienceItem.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data, error, isFetching } = useGetDeclaredExperienceView(
  { isValorized: true, pageSize: 100 }
)

const declaredExperiences = computed(() => (data.value?.data ?? []).filter(
  declaredExperience => declaredExperience.experienceType === EExperienceType.PERSONAL
))
const totalElements = computed(() => declaredExperiences.value.length)
const isEmpty = computed(() => totalElements.value === 0)
const declaredExperiencesRoute = { name: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name }
const emptyStateMessage = computed(() => t(
  'student.kit.cards.ValorizedElementsCardContainer.emptyState',
  { item: t('student.kit.views.StudentToolsKitView.valorizedDeclaredExperiencesContainer.emptyStateItemLabel') }
))
</script>

<template>
  <ValorizedElementsCardContainer
    :title="t('student.kit.views.StudentToolsKitView.valorizedDeclaredExperiencesContainer.title', { count: totalElements })"
    :error="error"
    :is-loading="isFetching"
    :is-empty="isEmpty"
    :empty-state-message="emptyStateMessage"
    :see-all-label="t('student.kit.views.StudentToolsKitView.valorizedDeclaredExperiencesContainer.seeAll')"
    :see-all-to="declaredExperiencesRoute"
    data-testid="valorized-declared-experiences-container"
    collapsed
  >
    <ValorizedDeclaredExperienceItem
      v-for="declaredExperience in declaredExperiences"
      :key="declaredExperience.id"
      :declared-experience="declaredExperience"
    />
  </ValorizedElementsCardContainer>
</template>
