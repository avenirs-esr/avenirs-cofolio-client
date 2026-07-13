<script setup lang="ts">
import { AvIcon, AvTooltip, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelectorOverlayElement {
  label: string
  value: string
  showSlot?: boolean
  baseElement?: unknown
  disabled?: boolean
  isLoading?: boolean
}

export interface SelectorOverlayProps {
  selectableElements: SelectorOverlayElement[]
  selectedAriaLabel?: string
  unselectedAriaLabel?: string
  checkboxColor?: string
  overlayColor?: string
  overlayOpacity?: number
  readonly?: boolean
  borderRadius?: string
  small?: boolean
  compact?: boolean
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
  compact = false,
} = defineProps<SelectorOverlayProps>()

const { t } = useI18n()

const selectedElements = defineModel<string[]>('selectedElements', { default: () => [] })

const iconScale = computed(() => small ? 0.75 : 1)

function onSelectElement (element: SelectorOverlayElement) {
  if (element.disabled || element.isLoading) {
    return
  }

  if (selectedElements.value.includes(element.value)) {
    selectedElements.value = selectedElements.value.filter(id => id !== element.value)
  }
  else {
    selectedElements.value = [...selectedElements.value, element.value]
  }
}

function getAriaLabel (element: SelectorOverlayElement) {
  if (selectedElements.value.includes(element.value)) {
    return selectedAriaLabel ?? t('global.overlay.SelectorOverlay.ariaLabel.selected', { item: element.label })
  }
  else {
    return unselectedAriaLabel ?? t('global.overlay.SelectorOverlay.ariaLabel.unselected', { item: element.label })
  }
}
</script>

<template>
  <div
    v-for="element in selectableElements"
    :key="element.value"
    class="selector-overlay__element av-col"
    :class="{ 'selector-overlay__element--disabled': element.disabled || element.isLoading }"
  >
    <AvTooltip
      :content="getAriaLabel(element)"
      :disabled="element.disabled || element.isLoading"
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
        :aria-label="getAriaLabel(element)"
        :aria-pressed="selectedElements.includes(element.value)"
        :aria-disabled="element.disabled || element.isLoading"
        class="selector-overlay__checkbox av-row av-px-xs av-justify-end"
        :class="{
          'selector-overlay__checkbox--selected': selectedElements.includes(element.value),
          'selector-overlay__checkbox--compact': compact,
        }"
        data-testid="selector-overlay"
        @click="() => onSelectElement(element)"
        @keydown.enter="() => onSelectElement(element)"
        @keydown.space="() => onSelectElement(element)"
      >
        <span class="selector-overlay__checkbox-icon">
          <AvIcon
            :name="element.isLoading ? MDI_ICONS.LOADING : (selectedElements.includes(element.value) ? MDI_ICONS.CHECKBOX_MARKED : MDI_ICONS.CHECKBOX_BLANK_OUTLINE)"
            :animation="element.isLoading ? 'spin' : undefined"
            :color="checkboxColor"
            :size="2"
          />
        </span>
      </a>
    </AvTooltip>
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

    &--compact &-icon {
      transform: translateY(0.75rem);
    }

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
