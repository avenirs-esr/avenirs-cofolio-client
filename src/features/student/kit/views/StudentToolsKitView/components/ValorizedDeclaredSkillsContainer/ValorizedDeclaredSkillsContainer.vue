<script setup lang="ts">
import { useGetDeclaredSkillsProgresses } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import ValorizedElementsCardContainer from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.vue'
import ValorizedDeclaredSkillItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredSkillItem/ValorizedDeclaredSkillItem.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data, error, isFetching } = useGetDeclaredSkillsProgresses(
  { isValorized: true, pageSize: 100 }
)

const declaredSkills = computed(() => data.value?.data ?? [])
const totalElements = computed(() => data.value?.page?.totalElements ?? 0)
const isEmpty = computed(() => totalElements.value === 0)
const declaredSkillsRoute = { name: ROUTES.STUDENT.PROJECT_SKILLS.name }
const emptyStateMessage = computed(() => t(
  'student.kit.cards.ValorizedElementsCardContainer.emptyState',
  { item: t('student.kit.views.StudentToolsKitView.valorizedDeclaredSkillsContainer.emptyStateItemLabel') }
))
</script>

<template>
  <ValorizedElementsCardContainer
    :title="t('student.kit.views.StudentToolsKitView.valorizedDeclaredSkillsContainer.title', { count: totalElements })"
    :error="error"
    :is-loading="isFetching"
    :is-empty="isEmpty"
    :empty-state-message="emptyStateMessage"
    :see-all-label="t('student.kit.views.StudentToolsKitView.valorizedDeclaredSkillsContainer.seeAll')"
    :see-all-to="declaredSkillsRoute"
    data-testid="valorized-declared-skills-container"
    collapsed
  >
    <ValorizedDeclaredSkillItem
      v-for="declaredSkill in declaredSkills"
      :key="declaredSkill.id"
      :declared-skill="declaredSkill"
    />
  </ValorizedElementsCardContainer>
</template>
