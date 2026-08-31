<script lang="ts" setup>
import type { SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import ValorizedItem from '@/features/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.vue'
import { SelfKnowledgeCategoryBadge } from '@/features/selfKnowledge'

export interface ValorizedSelfKnowledgeItemProps {
  element: SelfKnowledgeElementViewDTO
  showCategoryBadge?: boolean
}

const { element, showCategoryBadge = false } = defineProps<ValorizedSelfKnowledgeItemProps>()
</script>

<template>
  <ValorizedItem
    :title="element.title"
    :item-id="element.id"
    :parent-id="element.category.type"
    :type="element.category.type"
  >
    <div
      v-if="showCategoryBadge"
      class="av-row av-align-center av-wrap av-gap-xs"
    >
      <SelfKnowledgeCategoryBadge :category-type="element.category.type" />
    </div>
  </ValorizedItem>
</template>
