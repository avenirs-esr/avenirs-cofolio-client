<script setup lang="ts">
import { useGetDeclaredActivitiesView } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import ValorizedElementsCardContainer from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.vue'
import ValorizedActivityItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedActivityItem/ValorizedActivityItem.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data, error, isFetching } = useGetDeclaredActivitiesView(
  { isValorized: true, pageSize: 100 }
)

const activities = computed(() => data.value?.data ?? [])
const totalElements = computed(() => data.value?.page?.totalElements ?? 0)
const isEmpty = computed(() => totalElements.value === 0)
const activitiesRoute = { name: ROUTES.STUDENT.TOOLS_KIT_ACTIVITIES.name, query: { tab: 'ACTIVITY_LIBRARY' } }
const emptyStateMessage = computed(() => t(
  'student.kit.cards.ValorizedElementsCardContainer.emptyState',
  { item: t('student.kit.views.StudentToolsKitView.ValorizedActivitiesContainer.emptyStateItemLabel') }
))
</script>

<template>
  <ValorizedElementsCardContainer
    :title="t('student.kit.views.StudentToolsKitView.ValorizedActivitiesContainer.title', { count: totalElements })"
    :error="error"
    :is-loading="isFetching"
    :is-empty="isEmpty"
    :empty-state-message="emptyStateMessage"
    :see-all-label="t('student.kit.views.StudentToolsKitView.ValorizedActivitiesContainer.seeAll')"
    :see-all-to="activitiesRoute"
    data-testid="valorized-activities-container"
    collapsed
  >
    <ValorizedActivityItem
      v-for="activity in activities"
      :key="activity.id"
      :activity
    />
  </ValorizedElementsCardContainer>
</template>
