<script setup lang="ts">
import type { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { useGetSelfKnowledgeElements } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { ProjectTrajectoryItems } from '@/features/student/global/views/StudentProjectTrajectoriesView/types'
import ValorizedElementsCardContainer from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.vue'
import ValorizedItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.vue'
import { useI18n } from 'vue-i18n'

export interface ValorizedSelfKnowledgeInterestsContainerProps {
  category: ESelfKnowledgeCategory
}

const { category } = defineProps<ValorizedSelfKnowledgeInterestsContainerProps>()

const { t } = useI18n()

const { data, error, isFetching } = useGetSelfKnowledgeElements(
  { selfKnowledgeCategories: [category], isValorized: true, pageSize: 100 }
)

const elements = computed(() => data.value?.data ?? [])
const totalElements = computed(() => data.value?.page?.totalElements ?? 0)
const isEmpty = computed(() => totalElements.value === 0)

const seeAllTo = computed(() => {
  if (totalElements.value > 0) {
    return {
      name: ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY.name,
      params: {
        id: category
      }
    }
  }

  return {
    name: ROUTES.STUDENT.PROJECT_TRAJECTORIES.name,
    query: {
      section: ProjectTrajectoryItems.SELF_KNOWLEDGE
    }
  }
})

const emptyStateMessage = computed(() => t(
  'student.kit.cards.ValorizedElementsCardContainer.emptyState',
  { item: t(`student.kit.views.StudentToolsKitView.valorizedSelfKnowledgeContainer.${category}.emptyStateItemLabel`) }
))
</script>

<template>
  <ValorizedElementsCardContainer
    :title="t(`student.kit.views.StudentToolsKitView.valorizedSelfKnowledgeContainer.${category}.title`, { count: totalElements })"
    :error="error"
    :is-loading="isFetching"
    :is-empty="isEmpty"
    :empty-state-message="emptyStateMessage"
    :see-all-label="t(`student.kit.views.StudentToolsKitView.valorizedSelfKnowledgeContainer.${category}.seeAll`)"
    :see-all-to="seeAllTo"
    data-testid="valorized-self-knowledge-interests-container"
    collapsed
  >
    <ValorizedItem
      v-for="interest in elements"
      :key="interest.id"
      :title="interest.title"
      :item-id="interest.id"
      :parent-id="category"
      :type="category"
    />
  </ValorizedElementsCardContainer>
</template>
