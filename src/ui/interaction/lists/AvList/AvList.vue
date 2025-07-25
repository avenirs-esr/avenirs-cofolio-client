<script setup lang="ts">
import type AvListItem from '@/ui/interaction/lists/AvListItem/AvListItem.vue'
import type { VNode } from 'vue'

/**
 * AvList component props.
 */
export interface AvListProps {
  /**
   * The background color of the list.
   * @default 'transparent'
   */
  backgroundColor?: string

  /**
   * The border color of the list.
   * @default 'var(--stroke)'
   */
  borderColor?: string

  /**
   * The border radius of the list.
   * @default '0'
   */
  borderRadius?: string

  /**
   * Whether to show borders between list items.
   * @default false
   */
  bordered?: boolean

  /**
   * Whether to show a divider between list items.
   * @default false
   */
  divided?: boolean

  /**
   * The size variant of the list.
   * @default 'small'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large'

  /**
   * Custom padding for the list container.
   */
  padding?: string

  /**
   * Accessible label for the list.
   */
  ariaLabel?: string

  /**
   * ID of an element that labels the list.
   */
  ariaLabelledby?: string

  /**
   * ID of an element that describes the list.
   */
  ariaDescribedby?: string

  /**
   * The semantic role of the list.
   * @default 'list'
   */
  role?: 'list' | 'menu' | 'listbox' | 'group'
}

const {
  backgroundColor = 'transparent',
  borderColor = 'var(--stroke)',
  borderRadius = '0',
  bordered = false,
  divided = false,
  size = 'small',
  padding = '0',
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  role = 'list',
} = defineProps<AvListProps>()

/**
 * Slots available in the AvList component.
 */
defineSlots<{
  /**
   * Default slot for AvListItem components.
   */
  default?: () => VNode<typeof AvListItem>[]
}>()
const sizeClass = computed(() => `av-list--${size}`)
const borderedClass = computed(() => bordered ? 'av-list--bordered' : '')
const dividedClass = computed(() => divided ? 'av-list--divided' : '')
</script>

<template>
  <div
    class="av-list"
    :class="[sizeClass, borderedClass, dividedClass]"
    :role="role"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-describedby="ariaDescribedby"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.av-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  background: v-bind('backgroundColor');
  border-radius: v-bind('borderRadius');
  padding: v-bind('padding');

  &--bordered {
    border: 0.0625rem solid v-bind('borderColor');
  }

  &--divided {
    :deep(.av-list-item:not(:last-child)) {
      border-bottom: 0.0625rem solid v-bind('borderColor');
    }
  }

  &--xsmall {
    :deep(.av-list-item) {
      padding: var(--spacing-xs);
    }
  }

  &--small {
    :deep(.av-list-item) {
      padding: var(--spacing-sm) var(--spacing-xs);
    }
  }

  &--medium {
    :deep(.av-list-item) {
      padding: var(--spacing-md) var(--spacing-xs);
    }
  }

  &--large {
    :deep(.av-list-item) {
      padding: var(--spacing-lg) var(--spacing-xs);
    }
  }
}
</style>
