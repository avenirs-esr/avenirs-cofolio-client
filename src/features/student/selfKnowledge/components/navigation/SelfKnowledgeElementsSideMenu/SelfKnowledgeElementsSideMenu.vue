<script lang="ts" setup>
import type { ESelfKnowledgeCategoryType, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'
import { AvBadge, AvButton, AvIconText, AvSideMenu, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementsSideMenuProps {
  categoryType: ESelfKnowledgeCategoryType
  selectedElementId: string
  elements: SelfKnowledgeElementViewDTO[]
}

const { categoryType, elements } = defineProps<SelfKnowledgeElementsSideMenuProps>()

defineEmits<{
  (e: 'selectElement', elementId: string): void
}>()

const { t } = useI18n()

const isCollapsed = ref(false)

const iconOptions = computed(() => ({
  name: getSelfKnowledgeCategoryIcon(categoryType),
  color: 'var(--card)',
  bottom: '-1.25rem',
}))

const renderedElements = computed(() => {
  return elements.map((element, index) => ({
    ...element,
    valorized: index % 2 === 0 // TODO: waiting for API to provide this info
  }))
})
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
          {{ t(`student.views.studentProjectTrajectoriesView.selfKnowledge.navigation.elementsSideMenu.${categoryType.toLowerCase()}`) }}
        </span>
        ({{ elements.length }})
      </span>
      <AvIconText
        v-if="isCollapsed"
        :icon="iconOptions.name"
        :text="elements.length.toString()"
        typography-class="s2-bold"
        gap="var(--spacing-sm)"
      />
      <div class="self-knowledge-elements-side-menu__elements">
        <div
          v-for="element in renderedElements"
          :key="element.id"
        >
          <AvButton
            v-if="isCollapsed"
            :label="element.title"
            :icon="iconOptions.name"
            :variant="element.id === selectedElementId ? 'OUTLINED' : 'DEFAULT'"
            icon-only
            @click="$emit('selectElement', element.id)"
          />
          <div
            v-else
            role="button"
            tabindex="0"
            @keydown.enter="$emit('selectElement', element.id)"
            @keydown.space="$emit('selectElement', element.id)"
            @click="$emit('selectElement', element.id)"
          >
            <FloatingIconCard
              :class="{ 'floating-icon-card--selected': element.id === selectedElementId }"
              :title="element.title"
              :icon-options="iconOptions"
              :header-rows="2"
              height="5.75rem"
              custom-title-height="3.5rem"
              color="var(--dark-background-primary1)"
              border-color="var(--other-border-skill-card)"
              border-color-on-hover="var(--dark-background-primary1)"
              title-typography-classes="caption-regular"
            >
              <template #body>
                <AvBadge
                  v-if="element.valorized"
                  :label="t('student.views.studentProjectTrajectoriesView.selfKnowledge.elementsDetails.valorized')"
                  :icon="MDI_ICONS.STAR"
                  color="var(--light-foreground-accent)"
                  background-color="var(--light-background-accent)"
                  border-color="transparent"
                  ellipsis
                  small
                />
              </template>
            </FloatingIconCard>
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
  padding: var(--spacing-sm);

  &__elements {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);

    & div[role="button"] {
      cursor: pointer;
    }
  }

  .floating-icon-card--selected {
    :deep(.av-card) {
      border: 1px solid var(--dark-background-primary1) !important;
      box-shadow: 0 0 0 2px var(--dark-background-primary1);
    }
  }
}

:deep() {
  .floating-icon-card {
    min-width: 13.4375rem;
    max-width: 13.4375rem;

    &__title {
      color: var(--card);
      text-align: left;
    }

    &__icon {
      height: 1.9375rem;
      width: 1.9375rem;
    }
  }

  .av-card {
    &__title {
      padding-top: var(--spacing-xs);
      padding-bottom: var(--spacing-xs);
    }
  }

  .av-icon {
    &__icon {
      width: 90% !important;
      height: 90% !important;
    }
  }
}
</style>
