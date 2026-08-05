<script setup lang="ts">
import type { ESelfKnowledgeCategory, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import CompactCardSelector from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'

export interface SelfKnowledgeElementsSelectorProps {
  elements: SelfKnowledgeElementViewDTO[]
  categoryType: ESelfKnowledgeCategory
  readonly?: boolean
}

const { elements } = defineProps<SelfKnowledgeElementsSelectorProps>()

const selectedElementIds = defineModel<string[]>({ default: [] })

const selectableElements = computed(() => {
  return elements.map(element => ({
    id: element.id,
    title: element.title
  }))
})
</script>

<template>
  <div class="av-row av-justify-center av-gap-sm av-radius-md av-wrap">
    <CompactCardSelector
      v-model="selectedElementIds"
      :elements="selectableElements"
      :icon="getSelfKnowledgeCategoryIcon(categoryType)"
      color="var(--card)"
      background-color="var(--dark-background-primary1)"
      checkbox-color="var(--other-background-base)"
      overlay-color="var(--base)"
      :overlay-opacity="0.25"
      :readonly="readonly"
    />
  </div>
</template>
