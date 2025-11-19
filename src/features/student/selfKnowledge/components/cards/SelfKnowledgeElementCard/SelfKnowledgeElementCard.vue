<script lang="ts" setup>
import { ESelfKnowledgeCategoryType, type SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { Rating } from '@/common/components'
import { FloatingIconCard } from '@/features/student/global'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface SelfKnowledgeElementCardProps {
  element: SelfKnowledgeElementViewDTO
  categoryType: ESelfKnowledgeCategoryType
  categoryColor?: string
}

const {
  categoryColor = 'var(--light-foreground-primary1)',
  categoryType,
  element,
} = defineProps<SelfKnowledgeElementCardProps>()

function getCategoryIcon (categoryType: ESelfKnowledgeCategoryType): string {
  switch (categoryType) {
    case ESelfKnowledgeCategoryType.VALUES:
      return MDI_ICONS.DIAMOND_STONE
    case ESelfKnowledgeCategoryType.STRENGTHS:
      return MDI_ICONS.WEIGHTS
    case ESelfKnowledgeCategoryType.ASPIRATIONS:
      return RI_ICONS.HAND_HEART_LINE
    default:
      return MDI_ICONS.STAR_SHOOTING_OUTLINE
  }
}

const iconOptions = computed(() => ({
  name: getCategoryIcon(categoryType),
}))
</script>

<template>
  <FloatingIconCard
    :title="element.title"
    :header-rows="2"
    :icon-options="iconOptions"
    :color="categoryColor"
  >
    <template #body>
      <p class="b3-regular">
        {{ element.description }}
      </p>
    </template>
    <template
      v-if="element.rating"
      #footer
    >
      <Rating
        :rating="element.rating"
      />
    </template>
  </FloatingIconCard>
</template>
