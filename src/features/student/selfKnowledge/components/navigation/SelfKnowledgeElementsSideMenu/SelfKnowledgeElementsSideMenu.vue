<script lang="ts" setup>
import type { ESelfKnowledgeCategoryType, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import SelfKnowledgeElementCompactCard from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeElementCompactCard/SelfKnowledgeElementCompactCard.vue'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'
import { AvButton, AvIconText, AvSideMenu } from '@avenirs-esr/avenirs-dsav'
import { useInfiniteScroll } from '@vueuse/core'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementsSideMenuProps {
  categoryType: ESelfKnowledgeCategoryType
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
  { distance: 10 }
)

const isCollapsed = ref(false)

const iconName = computed(() => getSelfKnowledgeCategoryIcon(categoryType))
</script>

<template>
  <AvSideMenu
    v-model:collapsed="isCollapsed"
    collapsed-width="fit-content"
  >
    <div class="self-knowledge-elements-side-menu">
      <span
        class="s2-bold"
        :class="{
          'av-sr-only': isCollapsed,
        }"
      >
        <span class="s2-regular">
          {{ capitalize(t(`student.selfKnowledge.categoryType.${categoryType}`, { count: 2 })) }} - {{ t('student.selfKnowledge.SelfKnowledgeMainSection.navigation.elementsSideMenu') }}
        </span>
        ({{ countElements }})
      </span>
      <AvIconText
        v-if="isCollapsed"
        :icon="iconName"
        :text="elements.length.toString()"
        typography-class="s2-bold"
        gap="var(--spacing-sm)"
      />
      <div
        ref="elementsContainer"
        class="self-knowledge-elements-side-menu__elements"
      >
        <div
          v-for="element in elements"
          :key="element.id"
        >
          <AvButton
            v-if="isCollapsed"
            :label="element.title"
            :icon="iconName"
            :variant="element.id === selectedElementId ? 'OUTLINED' : 'DEFAULT'"
            icon-only
            @click="$emit('selectElement', element.id)"
          />
          <div
            v-else
            role="button"
            tabindex="0"
            :class="{ 'self-knowledge-elements-side-menu__element--selected': element.id === selectedElementId }"
            @keydown.enter="$emit('selectElement', element.id)"
            @keydown.space="$emit('selectElement', element.id)"
            @click="$emit('selectElement', element.id)"
          >
            <SelfKnowledgeElementCompactCard
              :title="element.title"
              :valorized="false"
              :icon-name="iconName"
            />
          </div>
        </div>
      </div>
    </div>
  </AvSideMenu>
</template>

<style lang="scss" scoped>
.self-knowledge-elements-side-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);

  &__elements {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    max-height: 40rem;
    overflow-y: auto;

    & div[role="button"] {
      cursor: pointer;
    }
  }

  &__element--selected {
    :deep(.av-card) {
      border: 1px solid var(--dark-background-primary1) !important;
      box-shadow: 0 0 0 2px var(--dark-background-primary1);
    }
  }
}
</style>
