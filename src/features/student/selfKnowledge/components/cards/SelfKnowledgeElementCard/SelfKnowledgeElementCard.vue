<script lang="ts" setup>
import type { SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { Rating } from '@/common/components'
import { ROUTE_NAMES } from '@/common/constants'
import { FloatingIconCard } from '@/features/student/global'
import {
  useSelfKnowledgeCategory
} from '@/features/student/selfKnowledge/composables/use-self-knowledge-category/use-self-knowledge-category'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'
import { toValue } from 'vue'

export interface SelfKnowledgeElementCardProps {
  element: SelfKnowledgeElementViewDTO
  categoryId: string
  categoryColor?: string
}

const {
  categoryColor = 'var(--light-foreground-primary1)',
  categoryId,
  element,
} = defineProps<SelfKnowledgeElementCardProps>()

const { categoryType } = useSelfKnowledgeCategory(computed(() => categoryId))

const iconOptions = computed(() => ({
  name: getSelfKnowledgeCategoryIcon(toValue(categoryType)),
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
