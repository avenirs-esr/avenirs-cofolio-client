<script lang="ts" setup>
import type { IconOptions } from '@avenirs-esr/shared'
import type { ESelfKnowledgeCategory, SelfKnowledgeElementViewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { COLORS, FloatingIconCard } from '@avenirs-esr/shared'
import { Rating } from '@/common/components'
import { useIdentifyRoute } from '@/common/composables/use-identify-route/use-identitfy-route'
import { ROUTES } from '@/common/constants'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'

export interface SelfKnowledgeElementCardProps {
  element: SelfKnowledgeElementViewDTO
  categoryType: ESelfKnowledgeCategory
}

const { categoryType, element, } = defineProps<SelfKnowledgeElementCardProps>()

const { isStudentToolsKitRoute } = useIdentifyRoute()

const iconOptions = computed<IconOptions>(() => ({
  name: getSelfKnowledgeCategoryIcon(categoryType),
  color: 'var(--icon)',
  bottom: 'var(--spacing-lg-neg)',
  borderColor: 'var(--stroke)',
}))
</script>

<template>
  <RouterLink
    :to="{
      name: isStudentToolsKitRoute ? ROUTES.STUDENT.TOOLS_KIT_SELFKNOWLEDGE_CATEGORY.name : ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY.name,
      params: { id: categoryType },
      query: { elementId: element.id },
    }"
    class="av-radius-2xl"
  >
    <FloatingIconCard
      :title="element.title"
      :header-rows="2"
      :icon-options="iconOptions"
      :color="COLORS.SELF_KNOWLEDGE"
      title-color="var(--text1)"
      border-color-on-hover="var(--dark-background-primary1)"
      class="self-knowledge-element-card"
      height="13rem"
    >
      <template #body>
        <div class="self-knowledge-element-card__body av-pt-xs">
          <span class="element-description av-max-lines caption-regular">
            {{ element.description }}
          </span>
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
