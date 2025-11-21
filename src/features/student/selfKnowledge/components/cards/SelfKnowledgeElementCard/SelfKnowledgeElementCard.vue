<script lang="ts" setup>
import type { ESelfKnowledgeCategoryType, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { Rating } from '@/common/components'
import { FloatingIconCard } from '@/features/student/global'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils'

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

const iconOptions = computed(() => ({
  name: getSelfKnowledgeCategoryIcon(categoryType),
}))
</script>

<template>
  <FloatingIconCard
    :title="element.title"
    :header-rows="2"
    :icon-options="iconOptions"
    :color="categoryColor"
    class="self-knowledge-element-card"
  >
    <template #body>
      <div class="self-knowledge-element-card__body">
        <p class="b3-regular">
          {{ element.description }}
        </p>
      </div>
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

<style lang="scss">
.self-knowledge-element-card {
  flex: 1;

  &__body {
    display: flex;
  }
}
</style>
