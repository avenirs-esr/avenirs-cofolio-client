<script lang="ts" setup>
import type { ESelfKnowledgeCategoryType, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { Rating } from '@/common/components'
import { ROUTE_NAMES } from '@/common/constants'
import { FloatingIconCard } from '@/features/student/global'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'

export interface SelfKnowledgeElementCardProps {
  element: SelfKnowledgeElementViewDTO
  categoryType: ESelfKnowledgeCategoryType
  categoryId: string
  categoryColor?: string
}

const {
  categoryColor = 'var(--light-foreground-primary1)',
  categoryId,
  categoryType,
  element,
} = defineProps<SelfKnowledgeElementCardProps>()

const iconOptions = computed(() => ({
  name: getSelfKnowledgeCategoryIcon(categoryType),
}))
</script>

<template>
  <RouterLink :to="{ name: ROUTE_NAMES.STUDENT.SELFKNOWLEDGE_CATEGORY.name, params: { id: categoryId }, query: { elementId: element.id } }">
    <FloatingIconCard
      :title="element.title"
      :header-rows="2"
      :icon-options="iconOptions"
      :color="categoryColor"
      class="self-knowledge-element-card"
    >
      <template #body>
        <div class="self-knowledge-element-card__body">
          <p class="caption-regular">
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
  </RouterLink>
</template>
