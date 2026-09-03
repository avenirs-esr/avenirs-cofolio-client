<script lang="ts" setup>
import type { Slot } from 'vue'
import { ESelfKnowledgeCategory, useGetSelfKnowledgeCategories } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { type ValorizedElementType, ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import { AvButton, AvTooltip, CUIDA_ICONS, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ValorizedItemProps {
  title: string
  itemId: string
  parentId?: string
  type: ValorizedElementType
}

const { itemId, parentId = '', type } = defineProps<ValorizedItemProps>()

defineSlots<{
  default: Slot
}>()

const titleRef = ref<HTMLElement | null>(null)
const { isTruncated } = useTextTruncation(titleRef)

const { t } = useI18n()

const isSelfKnowledgeItem = computed(() => Object.values(ESelfKnowledgeCategory).includes(type as ESelfKnowledgeCategory))

const { data: selfKnowledgeCategories } = useGetSelfKnowledgeCategories({
  query: { enabled: isSelfKnowledgeItem }
})

const to = computed(() => {
  if (isSelfKnowledgeItem.value && selfKnowledgeCategories.value) {
    return {
      name: ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY.name,
      params: { id: parentId },
      query: { elementId: itemId }
    }
  }

  switch (type) {
    case ValorizedItemType.ASSOCIATED_TRACE:
    case ValorizedItemType.NON_ASSOCIATED_TRACE:
      return {
        name: ROUTES.STUDENT.TOOLS_TRACE.name,
        params: { id: itemId },
      }
    case ValorizedItemType.DECLARED_EXPERIENCE:
      return {
        name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name,
        params: { id: itemId },
      }
    case ValorizedItemType.DECLARED_PROGRAM:
      return {
        name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name,
        params: { id: itemId },
      }
    case ValorizedItemType.DECLARED_SKILL:
      return {
        name: ROUTES.STUDENT.PROJECT_DECLARED_SKILL.name,
        params: { id: itemId },
      }
    default:
      return undefined
  }
})
</script>

<template>
  <div class="valorized-item av-row av-pt-sm">
    <div
      class=" av-col av-gap-xs av-w-full"
      data-testid="valorized-item"
    >
      <div class="av-row av-justify-between av-gap-sm">
        <AvTooltip
          :disabled="!isTruncated"
          :content="title"
          force-focusable
        >
          <span
            ref="titleRef"
            class="title s2-bold av-max-lines"
          >
            {{ title }}
          </span>
        </AvTooltip>
      </div>
      <slot />
    </div>
    <div class="av-col av-justify-center">
      <AvButton
        v-if="to"
        :label="t('global.buttons.access')"
        :icon="CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
        small
        :to="to"
        data-testid="access-button"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.valorized-item {
  .title {
    --max-lines: 1;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--stroke);
    padding-bottom: var(--spacing-sm);
  }
}
</style>
