<script lang="ts" setup>
import type { ESelfKnowledgeCategory, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { Rating } from '@/common/components'
import { useIdentifyRoute } from '@/common/composables/use-identify-route/use-identitfy-route'
import { ROUTES } from '@/common/constants'
import { FloatingIconCard } from '@/features/student/global'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'

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

const { isStudentToolsKitRoute } = useIdentifyRoute()

const iconOptions = computed(() => ({
  name: getSelfKnowledgeCategoryIcon(categoryType),
}))
</script>

<template>
  <RouterLink
    :to="{
      name: isStudentToolsKitRoute ? ROUTES.STUDENT.TOOLS_KIT_SELFKNOWLEDGE_CATEGORY.name : ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY.name,
      params: { id: categoryType },
      query: { elementId: element.id } }"
  >
    <FloatingIconCard
      :title="element.title"
      :header-rows="2"
      :icon-options="iconOptions"
      :color="categoryColor"
      class="self-knowledge-element-card"
      height="var(--dimension-7xl)"
    >
      <template #body>
        <div class="self-knowledge-element-card__body">
          <p class="element-description av-max-lines caption-regular av-pt-xs">
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

<style lang="scss" scoped>
.element-description {
  --max-lines: 3;
}
</style>
