<script lang="ts" setup>
import type { ESelfKnowledgeCategory, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import SideMenu from '@/common/components/navigation/SideMenu/SideMenu.vue'
import { INFINITE_SCROLL_BOTTOM_DISTANCE } from '@/common/constants'
import SelfKnowledgeElementCompactCard from '@/features/selfKnowledge/components/cards/SelfKnowledgeElementCompactCard/SelfKnowledgeElementCompactCard.vue'
import { getSelfKnowledgeCategoryIcon } from '@/features/selfKnowledge/utils/category.utils'
import { useInfiniteScroll } from '@vueuse/core'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementsSideMenuProps {
  categoryType: ESelfKnowledgeCategory
  selectedElementId: string
  elements: SelfKnowledgeElementViewDTO[]
  countElements?: number
}

const { categoryType, elements, countElements = 0 } = defineProps<SelfKnowledgeElementsSideMenuProps>()

const emit = defineEmits<{
  (e: 'selectElement', elementId: string): void
  (e: 'loadMoreElements'): void
}>()

const { t } = useI18n()

const elementsContainer = ref<HTMLElement | null>(null)

useInfiniteScroll(
  elementsContainer,
  () => {
    emit('loadMoreElements')
  },
  { distance: INFINITE_SCROLL_BOTTOM_DISTANCE }
)

const isCollapsed = ref(false)

const iconName = computed(() => getSelfKnowledgeCategoryIcon(categoryType))
</script>

<template>
  <SideMenu
    v-model:collapsed="isCollapsed"
    collapsed-width="fit-content"
  >
    <div class="av-col av-gap-md">
      <div
        v-if="!isCollapsed"
        ref="elementsContainer"
        class="self-knowledge-elements-side-menu__elements av-p-xxxs av-col av-gap-sm"
      >
        <span class="s2-bold">
          <span class="s2-regular">
            {{ capitalize(t(`student.selfKnowledge.categoryType.${categoryType}`, { count: 2 })) }} - {{ t('student.selfKnowledge.SelfKnowledgeMainSection.navigation.elementsSideMenu') }}
          </span>
          ({{ countElements }})
        </span>
        <div
          v-for="element in elements"
          :key="element.id"
        >
          <a
            role="button"
            tabindex="0"
            :aria-pressed="element.id === selectedElementId"
            :class="{ 'self-knowledge-elements-side-menu__element--selected': element.id === selectedElementId }"
            @keydown.enter="$emit('selectElement', element.id)"
            @keydown.space="$emit('selectElement', element.id)"
            @click="$emit('selectElement', element.id)"
          >
            <SelfKnowledgeElementCompactCard
              :title="element.title"
              :valorized="element.valorized ?? false"
              :icon-name="iconName"
            />
          </a>
        </div>
      </div>
    </div>
  </SideMenu>
</template>

<style lang="scss" scoped>
.self-knowledge-elements-side-menu {
  &__elements {
    max-height: 40rem;
    overflow-y: auto;
  }

  &__element--selected {
    :deep(.av-card) {
      border: 1px solid var(--dark-background-primary1) !important;
      box-shadow: 0 0 0 2px var(--dark-background-primary1);
    }
  }
}
</style>
