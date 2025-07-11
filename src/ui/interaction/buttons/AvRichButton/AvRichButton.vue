<script setup lang="ts">
import type { Slot } from 'vue'
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'

/**
 * AvRichButton component props.
 */
export interface AvRichButtonProps {
  /**
   * Button aria label and title for accessibility.
   */
  label: string

  /**
   * Icon displayed on the left of the button.
   * Must be an icon name.
   */
  iconLeft?: string

  /**
   * Icon displayed on the right of the button.
   * Must be an icon name.
   */
  iconRight?: string

  /**
   * Allows you to change the padding of the button.
   * @default '1rem'
   */
  customPadding?: string

  /**
   * Function called when button is clicked.
   * @param event The MouseEvent of the click.
   */
  onClick?: (event: MouseEvent) => void
}

const {
  label,
  iconLeft = undefined,
  iconRight = undefined,
  customPadding = 'var(--spacing-sm)',
  onClick
} = defineProps<AvRichButtonProps>()

/**
 * Slots available in the AvRichButton component.
 *
 * @slot default - Default slot for rich button content.
 */
defineSlots<{
  /**
   * Default slot for rich button content.
   */
  default: Slot
}>()
</script>

<template>
  <button
    class="av-rich-button"
    :title="label"
    :aria-label="label"
    @click="onClick"
  >
    <div class="av-rich-button__line">
      <div class="av-rich-button__left">
        <AvVIcon
          v-if="iconLeft"
          :name="iconLeft"
          color="var(--dark-background-primary1)"
          :size="1.5"
        />
        <slot />
      </div>
      <AvVIcon
        v-if="iconRight"
        :name="iconRight"
        color="var(--dark-background-primary1)"
        :size="1.5"
      />
    </div>
  </button>
</template>

<style lang="scss" scoped>
.av-rich-button {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: var(--radius-lg);
  border: 1px solid var(--stroke);
  overflow: hidden;
  padding: v-bind('customPadding');
}

.av-rich-button:hover {
  border: 1px solid var(--dark-background-primary1);
  box-shadow: 0 0 0 2px var(--dark-background-primary1);
  background: transparent !important;
}

.av-rich-button__line {
  display: flex;
  width: 100%;
  align-items: center;
  text-align: left;
}

.av-rich-button__left {
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: var(--spacing-sm);
  align-items: center;
  overflow: hidden;
}
</style>
