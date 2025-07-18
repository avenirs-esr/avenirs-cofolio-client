<script lang="ts" setup>
import type { Slot } from 'vue'
import toggleActiveSvg from '@/ui/interaction/toggles/AvToggle/assets/toggle-active.svg?url'
import toggleInactiveSvg from '@/ui/interaction/toggles/AvToggle/assets/toggle-inactive.svg?url'

/**
 * AvToggle component props.
 */
export interface AvToggleProps {
  /**
   * Boolean value linked to the input.
   */
  modelValue?: boolean

  /**
   * Unique id for the toggle. Used for accessibility.
   */
  id?: string

  /**
   * Indicates if the toggle disabled.
   */
  disabled?: boolean

  /**
   * Text to display next to the toggle (right) when it is active.
   * @default 'On'
   */
  activeText?: string

  /**
   * Text to display next to the toggle (right) when it is inactive.
   * @default 'Off'
   */
  inactiveText?: string

  /**
   * `name` attribute of the input
   * @default undefined
   */
  name?: string
}

const props = withDefaults(defineProps<AvToggleProps>(), {
  activeText: 'On',
  inactiveText: 'Off',
  name: undefined,
})

/**
 * Events emitted by the component.
 */
defineEmits<{
  /**
   * Emitted when the toggle is clicked.
   * @param value New state (`boolean`) of the toggle.
   */
  (e: 'update:modelValue', payload: boolean): void
}>()

/**
 * Slots available in the AvToggle component.
 *
 * @slot default - Default slot for the toggle description.
 */
defineSlots<{
  /**
   * Default slot for the toggle description.
   */
  default?: Slot
}>()

const inputId = computed(() => props.id ?? crypto.randomUUID())
const labelId = computed(() => {
  return `${inputId.value}-label`
})
</script>

<template>
  <label
    :id="labelId"
    class="av-toggle"
    :class="{
      'av-toggle--disabled': disabled,
    }"
    :for="inputId"
  >
    <div class="toggle">
      <svg
        width="34"
        height="14"
      >
        <image
          :href="modelValue ? toggleActiveSvg : toggleInactiveSvg"
          width="34"
          height="14"
        />
      </svg>
      <span
        v-if="modelValue"
        class="caption-bold"
      >
        {{ activeText }}
      </span>
      <span
        v-else
        class="caption-regular"
      >
        {{ inactiveText }}
      </span>
    </div>
    <slot />
  </label>
  <input
    :id="inputId"
    :style="{ display: 'none ' }"
    :disabled="disabled"
    :aria-disabled="disabled"
    type="checkbox"
    :checked="modelValue"
    :data-testid="inputId"
    :aria-describedby="labelId"
    :name="name"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
  >
</template>

<style lang="scss" scoped>
.av-toggle, .toggle {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  cursor: pointer;
  gap: var(--spacing-xs);
}

.toggle {
  gap: var(--spacing-xxs);
  align-items: center;
  width: 3.625rem;
}

.av-toggle--disabled {
  cursor: default;
}

.caption-bold {
  color: var(--dark-background-primary1);
  user-select: none;
}

.caption-regular {
  color: var(--text1);
  user-select: none;
}
</style>
