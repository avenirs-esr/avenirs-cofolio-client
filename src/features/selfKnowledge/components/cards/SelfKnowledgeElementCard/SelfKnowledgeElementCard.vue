<script lang="ts" setup>
import type { ESelfKnowledgeCategory, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { Rating } from '@/common/components'
import { ROUTES } from '@/common/constants'
import { FloatingIconCard } from '@/features/global'
import { getSelfKnowledgeCategoryIcon } from '@/features/selfKnowledge/utils/category.utils'

export interface SelfKnowledgeElementCardProps {
  element: SelfKnowledgeElementViewDTO
  categoryType: ESelfKnowledgeCategory
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
  <RouterLink :to="{ name: ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY.name, params: { id: categoryType }, query: { elementId: element.id } }">
    <FloatingIconCard
      :title="element.title"
      :header-rows="2"
      :icon-options="iconOptions"
      :color="categoryColor"
      class="self-knowledge-element-card"
      height="21.625rem"
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
