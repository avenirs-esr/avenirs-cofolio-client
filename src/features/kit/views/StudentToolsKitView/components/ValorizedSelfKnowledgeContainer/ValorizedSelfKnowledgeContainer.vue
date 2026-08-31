<script setup lang="ts">
import { ESelfKnowledgeCategory, useGetSelfKnowledgeElements } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { ProjectTrajectoryItems } from '@/features/global/views/StudentProjectTrajectoriesView/types'
import ValorizedElementsCardContainer from '@/features/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.vue'
import ValorizedSelfKnowledgeItem from '@/features/kit/views/StudentToolsKitView/components/ValorizedSelfKnowledgeItem/ValorizedSelfKnowledgeItem.vue'
import { useI18n } from 'vue-i18n'

export interface ValorizedSelfKnowledgeContainerProps {
  interestsOnly?: boolean
}

const { interestsOnly = false } = defineProps<ValorizedSelfKnowledgeContainerProps>()

const { t } = useI18n()

const categories = computed(() => interestsOnly
  ? [ESelfKnowledgeCategory.INTERESTS]
  : Object.values(ESelfKnowledgeCategory).filter(category => category !== ESelfKnowledgeCategory.INTERESTS))

const i18nKey = computed(() => interestsOnly ? ESelfKnowledgeCategory.INTERESTS : 'OTHERS')

const { data, error, isFetching } = useGetSelfKnowledgeElements(
  computed(() => ({ selfKnowledgeCategories: categories.value, isValorized: true, pageSize: 100 }))
)

const elements = computed(() => data.value?.data ?? [])
const totalElements = computed(() => data.value?.page?.totalElements ?? 0)
const isEmpty = computed(() => totalElements.value === 0)

const seeAllTo = computed(() => {
  if (interestsOnly && totalElements.value > 0) {
    return {
      name: ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY.name,
      params: {
        id: ESelfKnowledgeCategory.INTERESTS
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
  { item: t(`student.kit.views.StudentToolsKitView.valorizedSelfKnowledgeContainer.${i18nKey.value}.emptyStateItemLabel`) }
))

const dataTestId = computed(() => interestsOnly
  ? 'valorized-self-knowledge-interests-container'
  : 'valorized-self-knowledge-others-container')
</script>

<template>
  <ValorizedElementsCardContainer
    :title="t(`student.kit.views.StudentToolsKitView.valorizedSelfKnowledgeContainer.${i18nKey}.title`, { count: totalElements })"
    :error="error"
    :is-loading="isFetching"
    :is-empty="isEmpty"
    :empty-state-message="emptyStateMessage"
    :see-all-label="t(`student.kit.views.StudentToolsKitView.valorizedSelfKnowledgeContainer.${i18nKey}.seeAll`)"
    :see-all-to="seeAllTo"
    :data-testid="dataTestId"
    collapsed
  >
    <ValorizedSelfKnowledgeItem
      v-for="element in elements"
      :key="element.id"
      :element="element"
      :show-category-badge="!interestsOnly"
    />
  </ValorizedElementsCardContainer>
</template>
