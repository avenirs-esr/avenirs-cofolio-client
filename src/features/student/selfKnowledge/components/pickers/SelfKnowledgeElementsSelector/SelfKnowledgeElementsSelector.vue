<script setup lang="ts">
import type { ESelfKnowledgeCategoryType, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import SelfKnowledgeElementCompactCard from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeElementCompactCard/SelfKnowledgeElementCompactCard.vue'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'
import { AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementsSelectorProps {
  elements: SelfKnowledgeElementViewDTO[]
  categoryType: ESelfKnowledgeCategoryType
  readonly?: boolean
}

defineProps<SelfKnowledgeElementsSelectorProps>()
const { t } = useI18n()

const selectedElementIds = defineModel<string[]>({ default: [] })

function onSelectElement (elementId: string) {
  if (selectedElementIds.value.includes(elementId)) {
    selectedElementIds.value = selectedElementIds.value.filter(id => id !== elementId)
  }
  else {
    selectedElementIds.value = [...selectedElementIds.value, elementId]
  }
}
</script>

<template>
  <div class="elements-selector__container av-row av-row--center av-flex-row-sm">
    <div
      v-for="element in elements"
      :key="element.id"
      class="self-knowledge-element-compact-card__wrapper"
    >
      <SelfKnowledgeElementCompactCard
        :title="element.title"
        :valorized="false"
        :icon-name="getSelfKnowledgeCategoryIcon(categoryType)"
      />
      <div
        v-if="!readonly"
        class="self-knowledge-element-compact-card__overlay"
        :class="{ 'self-knowledge-element-compact-card__overlay--selected': selectedElementIds.includes(element.id) }"
        role="button"
        tabindex="0"
        :aria-label="t(`student.views.studentProjectTrajectoriesView.selfKnowledge.categoryElementsPaginator.modals.deleteElements.title.${categoryType.toLowerCase()}`, { title: element.title })"
        @click="() => onSelectElement(element.id)"
      >
        <AvIcon
          :name="selectedElementIds.includes(element.id) ? MDI_ICONS.CHECKBOX_MARKED : MDI_ICONS.CHECKBOX_BLANK_OUTLINE"
          color="var(--other-background-base)"
          :size="2"
        />
      </div>
    </div>
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
