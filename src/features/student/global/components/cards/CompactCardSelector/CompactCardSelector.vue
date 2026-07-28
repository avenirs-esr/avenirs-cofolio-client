<script setup lang="ts">
import SelectorOverlay from '@/common/components/overlay/SelectorOverlay/SelectorOverlay.vue'
import CompactCard from '@/features/student/global/components/cards/CompactCard/CompactCard.vue'
import { getUnknownElementProp } from '@/features/student/global/components/cards/CompactCardSelector/utils'

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
  elements: { id: string, title: string, showSlot?: boolean, baseElement?: unknown, disabled?: boolean, isLoading?: boolean }[]
  readonly?: boolean
  icon: string
  color?: string
  iconColor?: string
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
  iconColor = undefined,
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

const selectedElements = defineModel<string[]>({ default: [] })

const selectableElements = computed(() => {
  return elements.map(element => ({
    value: element.id,
    label: element.title,
    showSlot: getUnknownElementProp<boolean>(element, 'showSlot') ?? false,
    baseElement: element.baseElement,
    disabled: getUnknownElementProp<boolean>(element, 'disabled') ?? false,
    isLoading: getUnknownElementProp<boolean>(element, 'isLoading') ?? false
  }))
})

const iconOptions = computed(() => ({
  color: iconColor ?? color,
  borderColor: iconBorderColor ?? 'var(--other-border-skill-card)'
}))
</script>

<template>
  <div class="av-row av-justify-center av-gap-sm av-radius-md av-wrap">
    <SelectorOverlay
      v-model:selected-elements="selectedElements"
      :selectable-elements="selectableElements"
      :checkbox-color="checkboxColor"
      :overlay-color="overlayColor"
      :overlay-opacity="overlayOpacity"
      :readonly="readonly"
      border-radius="var(--radius-lg)"
      small
    >
      <template #default="{ label, value, showSlot, baseElement }">
        <CompactCard
          v-bind="$attrs"
          :element="{ id: value, title: label }"
          :icon="icon"
          :icon-color="iconOptions.color"
          :color="color"
          :background-color="backgroundColor"
          border-color="var(--other-border-skill-card)"
          :icon-border-color="iconOptions.borderColor"
          data-testid="compact-card-selector-item"
          :data-element-id="value"
        >
          <slot
            v-if="showSlot"
            :element="baseElement"
          />
        </CompactCard>
      </template>
    </SelectorOverlay>
  </div>
</template>
