<script setup lang="ts">
import { AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelectorOverlayProps {
  selectableElements: { label: string, value: string, showSlot?: boolean, baseElement?: unknown, disabled?: boolean }[]
  selectedAriaLabel?: string
  unselectedAriaLabel?: string
  checkboxColor?: string
  overlayColor?: string
  overlayOpacity?: number
  readonly?: boolean
  borderRadius?: string
  small?: boolean
}

const {
  selectableElements,
  selectedAriaLabel,
  unselectedAriaLabel,
  checkboxColor = 'var(--dark-background-primary1)',
  overlayColor = 'var(--dark-background-primary1)',
  overlayOpacity = 0.1,
  readonly = false,
  borderRadius = '1.5rem',
  small = false,
} = defineProps<SelectorOverlayProps>()

const { t } = useI18n()

const selectedElements = defineModel<string[]>('selectedElements', { default: [] })

const iconScale = computed(() => small ? 0.75 : 1)

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
    :class="{ 'selector-overlay__element--disabled': element.disabled }"
  >
    <slot
      name="default"
      :label="element.label"
      :value="element.value"
      :show-slot="element.showSlot"
      :base-element="element.baseElement"
    />
    <a
      v-if="!readonly"
      role="button"
      tabindex="0"
      :aria-label="getAriaLabel(element.value, element.label)"
      :title="getAriaLabel(element.value, element.label)"
      :aria-pressed="selectedElements.includes(element.value)"
      :aria-disabled="element.disabled"
      class="selector-overlay__checkbox av-row av-px-xs av-justify-end"
      :class="{ 'selector-overlay__checkbox--selected': selectedElements.includes(element.value) }"
      data-testid="selector-overlay"
      @click="() => !element.disabled && onSelectElement(element.value)"
      @keydown.enter="() => !element.disabled && onSelectElement(element.value)"
      @keydown.space="() => !element.disabled && onSelectElement(element.value)"
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

    &--disabled {
      cursor: not-allowed;
      opacity: 0.45;
      filter: grayscale(1);
    }
  }

  &__checkbox {
    position: absolute;
    top: calc(-1 * var(--spacing-xxs));
    left: 0;
    right: calc(-1 * var(--spacing-xxs));;
    bottom: 0;
    border-radius: v-bind('borderRadius');

    &::before {
      content: '';
      position: absolute;
      top: var(--spacing-xxs);
      left: 0;
      right: var(--spacing-xxs);
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

:deep() {
  .av-icon {
    scale: v-bind('iconScale') !important;
  }
}
</style>
