<script setup lang="ts">
import type { Slot } from 'vue'
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'

/**
 * AvListItem component props.
 */
export interface AvListItemProps {
  /**
   * The icon name according to the naming convention defined for `VIcon` on VueDSFR.
   */
  icon?: string

  /**
   * The icon color.
   * @default 'var(--text1)'
   */
  color?: string

  /**
   * The icon size.
   * @default 1.3125
   */
  iconSize?: number

  /**
   * The title text.
   */
  title?: string

  /**
   * The description text.
   */
  description?: string

  /**
   * The hover color when the list item is clickable.
   * @default 'var(--dark-background-primary1)'
   */
  hoverBackgroundColor?: string

  /**
   * The color when the list item is hovered.
   * @default 'var(--dark-background-primary1)'
   */
  colorOnHover?: string

  /**
   * The description color.
   * @default 'var(--text2)'
   */
  descriptionColor?: string

  /**
   * Whether the list item is clickable.
   * @default false
   */
  clickable?: boolean

  /**
   * Whether the list item is disabled.
   * @default false
   */
  disabled?: boolean

  /**
   * Whether the list item is selected/active.
   * @default false
   */
  selected?: boolean

  /**
   * Function called when list item is clicked.
   * @param event The click MouseEvent
   */
  onClick?: ($event: MouseEvent) => void

  /**
   * ARIA label for the list item when clickable.
   */
  ariaLabel?: string

  /**
   * ID of an element that describes the list item.
   */
  ariaDescribedby?: string

  /**
   * HTML tag to use for the root element when clickable.
   * @default 'button'
   */
  tag?: 'button' | 'div' | 'a'

  /**
   * Href attribute when tag is 'a'.
   */
  href?: string

  /**
   * Target attribute when tag is 'a'.
   */
  target?: string

  /**
   * Rel attribute when tag is 'a'.
   */
  rel?: string
}

const {
  icon,
  color = 'var(--text1)',
  descriptionColor = 'var(--text2)',
  hoverBackgroundColor = 'var(--dark-background-primary1)',
  colorOnHover = 'var(--card)',
  iconSize = 1.3125,
  title,
  description,
  clickable = false,
  disabled = false,
  selected = false,
  onClick,
  ariaLabel,
  ariaDescribedby,
  tag = 'button',
  href,
  target,
  rel
} = defineProps<AvListItemProps>()

/**
 * Slots available in the AvListItem component.
 */
const slots = defineSlots<{
  /**
   * Default slot for custom content.
   */
  default?: Slot
}>()

const componentTag = computed(() => {
  if (!clickable) {
    return 'div'
  }
  return tag
})

const computedAriaLabel = computed(() => {
  if (ariaLabel) {
    return ariaLabel
  }
  if (title && description) {
    return `${title}, ${description}`
  }
  return title || description || undefined
})

function handleClick (event: MouseEvent) {
  if (!clickable || disabled) {
    return
  }
  onClick?.(event)
}

function handleKeyDown (event: KeyboardEvent) {
  if (!clickable || disabled) {
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    const mouseEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    onClick?.(mouseEvent)
  }
}

const clickableClass = computed(() => clickable ? 'av-list-item--clickable' : '')
const disabledClass = computed(() => disabled ? 'av-list-item--disabled' : '')
const selectedClass = computed(() => selected ? 'av-list-item--selected' : '')
</script>

<template>
  <component
    :is="componentTag"
    class="av-list-item"
    :class="[clickableClass, disabledClass, selectedClass]"
    :tabindex="clickable && !disabled ? 0 : undefined"
    :aria-label="clickable ? computedAriaLabel : undefined"
    :aria-describedby="ariaDescribedby"
    :aria-disabled="disabled ? 'true' : undefined"
    :disabled="disabled && componentTag === 'button' ? true : undefined"
    :href="componentTag === 'a' ? href : undefined"
    :target="componentTag === 'a' ? target : undefined"
    :rel="componentTag === 'a' ? rel : undefined"
    :role="clickable && componentTag === 'div' ? 'button' : undefined"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <div
      v-if="icon"
      class="av-list-item__icon"
    >
      <AvVIcon
        :name="icon"
        :color="color"
        :size="iconSize"
      />
    </div>

    <div class="av-list-item__content">
      <div
        v-if="title"
        class="av-list-item__title"
      >
        {{ title }}
      </div>

      <div
        v-if="description"
        class="av-list-item__description"
      >
        {{ description }}
      </div>
      <div
        v-if="slots.default"
        class="av-list-item__custom-content"
      >
        <slot />
      </div>
    </div>
  </component>
</template>

<style lang="scss" scoped>
@mixin hoverColors {
  .av-list-item__title,
  .av-list-item__description,
  .av-list-item__custom-content {
    color: v-bind('colorOnHover');
  }

  .av-list-item__icon :deep(svg) {
    color: v-bind('colorOnHover');
  }
}

.av-list-item {
  display: flex;
  gap: var(--spacing-xs);
  border: none;
  background: transparent;
  text-align: left;
  width: 100%;
  cursor: default;
  transition: all 0.2s ease-in-out;
  font-weight: var(--font-weight-bold);
  align-items: center;

  &__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &__title {
    color: v-bind('color');
    font-size: var(--font-size-sm);
    margin: 0;
  }

  &__description {
    color: v-bind('descriptionColor');
    margin: 0;
  }

  &__custom-content {
    margin-top: var(--spacing-xs);
  }

  &--clickable {
    cursor: pointer;
    border-radius: var(--radius-sm);

    &:hover:not(.av-list-item--disabled) {
      background-color: v-bind('hoverBackgroundColor');
      transform: translateY(-0.0625rem);
      @include hoverColors;
    }

    &:focus-visible {
      outline: 0.125rem solid var(--dark-background-primary1);
      outline-offset: 0.125rem;
      background-color: v-bind('hoverBackgroundColor');
      @include hoverColors;
    }

    &:active:not(.av-list-item--disabled) {
      transform: translateY(0);
      box-shadow: 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.1);
    }
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;

    .av-list-item__title,
    .av-list-item__description {
      color: var(--text3);
    }

    .av-list-item__icon {
      opacity: 0.5;
    }
  }

  &--selected {
    background-color: v-bind('hoverBackgroundColor');
    @include hoverColors;
  }
}
</style>
