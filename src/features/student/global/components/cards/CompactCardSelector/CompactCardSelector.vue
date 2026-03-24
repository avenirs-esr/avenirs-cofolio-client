<script setup lang="ts">
import { getUnknownElementProp } from '@/features/student/global/components/cards/CompactCardSelector/utils'
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import SelectorOverlay from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.vue'

/**
 * @example
 * -- SCRIPT PART --
 * const selectedElementIds = ref<string[]>([])
 *
 * const selectableElements = [
 *   { id: '1', title: 'Element 1', showSlot: props.customCondition },
 *   { id: '2', title: 'Element 2' },
 *   { id: '3', title: 'Element 3', showSlot: true }
 * ]
 *
 * -- TEMPLATE PART --
 * <CompactCardSelector
 *   v-model="selectedElementIds"
 *   :elements="selectableElements"
 *   icon="mdi-check"
 *   color="var(--text1)"
 *   background-color="var(--surface-background)"
 *   :checkbox-color="'var(--dark-background-primary1)'"
 *   :overlay-color="'var(--dark-background-primary1)'"
 *   :overlay-opacity="0.25"
 * >
 *   <template #default="{ element }">
 *     Some content for {{ getUnknownElementProp<string>(element, 'title') }}
 *   </template>
 * </CompactCardSelector>
 */

export interface CompactCardSelectorProps {
  elements: { id: string, title: string, showSlot?: boolean }[]
  readonly?: boolean
  icon: string
  color?: string
  backgroundColor?: string
  iconBorderColor?: string
  checkboxColor?: string
  overlayColor?: string
  overlayOpacity?: number
}

defineOptions({
  inheritAttrs: false
})

const {
  elements,
  icon,
  iconBorderColor,
  color = 'var(--text1)',
  backgroundColor = 'var(--light-background-neutral)',
  checkboxColor = 'var(--dark-background-primary1)',
  overlayColor = 'var(--dark-background-primary1)',
  overlayOpacity = 0.25,
} = defineProps<CompactCardSelectorProps>()

defineSlots<{
  /**
   * You can use the `element` property of the slot scope to conditionally display content for specific elements. For example, if your elements have a `showSlot` boolean property, you can check it with `v-if="(element as { showSlot?: boolean })?.showSlot"`.
   */
  default: { element: unknown }
}>()

const selectedElementIds = defineModel<string[]>({ default: [] })

const selectableElements = computed(() => {
  return elements.map(element => ({
    value: element.id,
    label: element.title,
    baseElement: element
  }))
})

const iconOptions = computed(() => ({
  name: icon,
  color,
  bottom: '-2rem',
  borderColor: iconBorderColor ?? 'var(--other-border-skill-card)'
}))

function verifyShowSlot (element: unknown): boolean {
  return getUnknownElementProp<boolean>(element, 'showSlot') ?? false
}
</script>

<template>
  <div class="av-row av-justify-center av-gap-sm av-radius-md av-wrap">
    <SelectorOverlay
      v-model:selected-elements="selectedElementIds"
      :selectable-elements="selectableElements"
      :checkbox-color="checkboxColor"
      :overlay-color="overlayColor"
      :overlay-opacity="overlayOpacity"
      :readonly="readonly"
      border-radius="var(--radius-lg)"
    >
      <template #default="{ label, baseElement }">
        <FloatingIconCard
          v-bind="$attrs"
          :title="label"
          :title-color="color"
          :color="backgroundColor"
          :icon-options="iconOptions"
          border-color="var(--other-border-skill-card)"
          :header-rows="2"
          height="5.75rem"
          custom-title-height="3.25rem"
          title-typography-classes="caption-regular"
        >
          <template #body>
            <slot
              v-if="verifyShowSlot(baseElement)"
              :element="baseElement"
            />
          </template>
        </FloatingIconCard>
      </template>
    </SelectorOverlay>
  </div>
</template>

<style lang="scss" scoped>
.floating-icon-card {
  min-width: 13.4375rem !important;
  max-width: 13.4375rem !important;
}

:deep() {
  .floating-icon-card {
    &__title {
      text-align: left;
      margin-right: var(--spacing-lg) !important;
    }

    &__icon {
      height: var(--dimension-lg);
      width: var(--dimension-lg);
    }
}

  .av-card {
    padding: var(--spacing-xxs) !important;
    border-radius: var(--radius-lg) !important;

    &__title {
      padding-top: var(--spacing-xs);
      padding-bottom: var(--spacing-xs);
    }

    &__content-collapsible {
      padding-top: var(--spacing-xxs) !important;
    }
  }

  .av-icon {
    scale: 0.75 !important;
  }

  .selector-overlay__checkbox {
    padding-top: var(--spacing-none) !important;
  }
}
</style>
