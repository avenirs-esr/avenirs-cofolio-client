<script setup lang="ts">
import { AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelectorOverlayProps {
  selectableElements: { label: string, value: string, baseElement?: unknown }[]
  selectedAriaLabel?: string
  unselectedAriaLabel?: string
  checkboxColor?: string
  overlayColor?: string
  overlayOpacity?: number
  readonly?: boolean
  borderRadius?: string
}

const {
  selectableElements,
  selectedAriaLabel,
  unselectedAriaLabel,
  checkboxColor = 'var(--dark-background-primary1)',
  overlayColor = 'var(--dark-background-primary1)',
  overlayOpacity = 0.1,
  readonly = false,
  borderRadius = '1.5rem'
} = defineProps<SelectorOverlayProps>()

const { t } = useI18n()

const selectedElements = defineModel<string[]>('selectedElements', { default: [] })

function onSelectElement (elementValue: string) {
  if (selectedElements.value.includes(elementValue)) {
    selectedElements.value = selectedElements.value.filter(id => id !== elementValue)
  }
  else {
    selectedElements.value = [...selectedElements.value, elementValue]
  }
}

function getAriaLabel (elementValue: string, elementLabel: string) {
  if (selectedElements.value.includes(elementValue)) {
    return selectedAriaLabel ?? t('student.global.interaction.SelectorOverlay.ariaLabel.selected', { item: elementLabel })
  }
  else {
    return unselectedAriaLabel ?? t('student.global.interaction.SelectorOverlay.ariaLabel.unselected', { item: elementLabel })
  }
}
</script>

<template>
  <div
    v-for="element in selectableElements"
    :key="element.value"
    class="selector-overlay__element av-col"
  >
    <slot
      name="default"
      :label="element.label"
      :value="element.value"
      :base-element="element.baseElement"
    />
    <a
      v-if="!readonly"
      role="button"
      tabindex="0"
      :aria-label="getAriaLabel(element.value, element.label)"
      :title="getAriaLabel(element.value, element.label)"
      :aria-pressed="selectedElements.includes(element.value)"
      class="selector-overlay__checkbox av-row av-px-xs av-py-xs av-justify-end"
      :class="{ 'selector-overlay__checkbox--selected': selectedElements.includes(element.value) }"
      data-testid="selector-overlay"
      @click="() => onSelectElement(element.value)"
      @keydown.enter="() => onSelectElement(element.value)"
      @keydown.space="() => onSelectElement(element.value)"
    >
      <AvIcon
        :name="selectedElements.includes(element.value) ? MDI_ICONS.CHECKBOX_MARKED : MDI_ICONS.CHECKBOX_BLANK_OUTLINE"
        :color="checkboxColor"
        :size="2"
      />
    </a>
  </div>
</template>

<style lang="scss" scoped>
.selector-overlay {
  &__element {
    position: relative;
    cursor: pointer;
  }

  &__checkbox {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: v-bind('borderRadius');

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: v-bind('borderRadius');
      background-color: transparent;
    }

    &--selected::before {
      background-color: v-bind('overlayColor');
      opacity: v-bind('overlayOpacity');
    }
  }
}
</style>
