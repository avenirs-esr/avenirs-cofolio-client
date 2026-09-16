<script setup lang="ts">
import { useGetDeclaredExperienceView } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { ProBasedExperienceType } from '@/features/student/global/types/experiences.types'
import ValorizedElementsCardContainer from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.vue'
import ValorizedDeclaredExperienceItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredExperienceItem/ValorizedDeclaredExperienceItem.vue'
import { isProfessional } from '@/features/student/personalCareer/utils/experiences-utils/experiences-utils'
import { useI18n } from 'vue-i18n'

export interface ValorizedDeclaredExperiencesContainerProps {
  professionalExperience: boolean
}

const { professionalExperience } = defineProps<ValorizedDeclaredExperiencesContainerProps>()

const { t } = useI18n()

const { data, error, isFetching } = useGetDeclaredExperienceView(
  { isValorized: true, pageSize: 100 }
)

const experienceType = computed(() => professionalExperience ? ProBasedExperienceType.PROFESSIONAL : ProBasedExperienceType.OTHER)

const declaredExperiences = computed(() => (data.value?.data ?? []).filter(experience =>
  isProfessional(experience, professionalExperience)))
const totalElements = computed(() => declaredExperiences.value.length)
const isEmpty = computed(() => totalElements.value === 0)
const declaredExperiencesRoute = computed(() => ({
  name: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name,
  query: { type: experienceType.value }
}))
const emptyStateMessage = computed(() => t(
  'student.kit.cards.ValorizedElementsCardContainer.emptyState',
  { item: t('student.kit.views.StudentToolsKitView.valorizedDeclaredExperiencesContainer.emptyStateItemLabel') }
))
const title = computed(() => t(
  `student.kit.views.StudentToolsKitView.valorizedDeclaredExperiencesContainer.${experienceType.value}.title`,
  { count: totalElements.value }
))
const seeAllLabel = computed(() => t(
  `student.kit.views.StudentToolsKitView.valorizedDeclaredExperiencesContainer.${experienceType.value}.seeAll`
))
const dataTestid = computed(() => `valorized-${experienceType.value.toLowerCase()}-experiences-container`)
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
