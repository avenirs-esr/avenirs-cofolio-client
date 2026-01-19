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
  <div class="elements-selector__container av-row av-justify-center av-gap-sm">
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

<style lang="scss" scoped>
.elements-selector {
  &__container {
    padding: var(--spacing-md);
    border-radius: var(--radius-xl);

    .self-knowledge-element-compact-card {
      &__wrapper {
        position: relative;
        cursor: pointer;
      }

      &__overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--light-background-overlay);
        border-radius: var(--radius-xl);
        display: flex;
        justify-content: flex-end;
        transition: opacity 0.2s ease-in-out;
        padding:  var(--spacing-xxs) var(--spacing-xs);

        &--selected {
          background-color: transparent;
        }
      }
    }
  }
}
</style>
