<script setup lang="ts">
import type { ESelfKnowledgeCategoryType, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import SelectorOverlay from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.vue'
import SelfKnowledgeElementCompactCard from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeElementCompactCard/SelfKnowledgeElementCompactCard.vue'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'

export interface SelfKnowledgeElementsSelectorProps {
  elements: SelfKnowledgeElementViewDTO[]
  categoryType: ESelfKnowledgeCategoryType
  readonly?: boolean
}

const { elements } = defineProps<SelfKnowledgeElementsSelectorProps>()

const selectedElementIds = defineModel<string[]>({ default: [] })

const selectableElements = computed(() => {
  return elements.map(element => ({
    value: element.id,
    label: element.title
  }))
})
</script>

<template>
  <div class="av-row av-justify-center av-gap-sm av-radius-md av-wrap">
    <SelectorOverlay
      v-model:selected-elements="selectedElementIds"
      :selectable-elements="selectableElements"
      checkbox-color="var(--other-background-base)"
      overlay-color="var(--base)"
      :overlay-opacity="0.25"
      :readonly="readonly"
    >
      <template #default="{ label }">
        <SelfKnowledgeElementCompactCard
          :title="label"
          :valorized="false"
          :icon-name="getSelfKnowledgeCategoryIcon(categoryType)"
        />
      </template>
    </SelectorOverlay>
  </div>
</template>
