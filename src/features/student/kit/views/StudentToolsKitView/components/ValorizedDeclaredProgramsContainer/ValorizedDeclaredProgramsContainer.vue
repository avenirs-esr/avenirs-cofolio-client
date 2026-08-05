<script setup lang="ts">
import { useGetDeclaredPrograms } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import ValorizedElementsCardContainer from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.vue'
import ValorizedDeclaredProgramItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredProgramItem/ValorizedDeclaredProgramItem.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data, error, isFetching } = useGetDeclaredPrograms(
  { isValorized: true, pageSize: 100 }
)

const declaredPrograms = computed(() => data.value?.data ?? [])
const totalElements = computed(() => data.value?.page?.totalElements ?? 0)
const isEmpty = computed(() => totalElements.value === 0)
const declaredProgramsRoute = { name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name }
const emptyStateMessage = computed(() => t(
  'student.kit.cards.ValorizedElementsCardContainer.emptyState',
  { item: t('student.kit.views.StudentToolsKitView.valorizedDeclaredProgramsContainer.emptyStateItemLabel') }
))
</script>

<template>
  <ValorizedElementsCardContainer
    :title="t('student.kit.views.StudentToolsKitView.valorizedDeclaredProgramsContainer.title', { count: totalElements })"
    :error="error"
    :is-loading="isFetching"
    :is-empty="isEmpty"
    :empty-state-message="emptyStateMessage"
    :see-all-label="t('student.kit.views.StudentToolsKitView.valorizedDeclaredProgramsContainer.seeAll')"
    :see-all-to="declaredProgramsRoute"
    data-testid="valorized-declared-programs-container"
    collapsed
  >
    <ValorizedDeclaredProgramItem
      v-for="declaredProgram in declaredPrograms"
      :key="declaredProgram.id"
      :declared-program="declaredProgram"
    />
  </ValorizedElementsCardContainer>
</template>
