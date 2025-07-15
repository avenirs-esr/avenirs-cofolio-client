<script lang="ts" setup>
import { DsfrSelect } from '@gouvminint/vue-dsfr'

/**
 * AvSelect compoment props.
 */
export interface AvSelectProps {
  /**
   * Indicates if the select is required.
   */
  required?: boolean

  /**
   * Indicated if the select is disabled.
   */
  disabled?: boolean

  /**
   * Unique id for the select. Used for the accessibility.
   */
  selectId?: string

  /**
   * Field name.
   */
  name?: string

  /**
   * Hint for guidance.
   */
  hint?: string

  /**
   * Selected option value.
   */
  modelValue?: string | number | null | undefined

  /**
   * Select text label.
   */
  label?: string

  /**
   * Selectable options.
   */
  options?: {
    value: string | number | null | undefined
    text: string
    disabled?: boolean
  }[]

  /**
   * If set, display a success message.
   */
  successMessage?: string

  /**
   * If set, display an error message.
   */
  errorMessage?: string

  /**
   * Placeholder text.
   */
  defaultUnselectedText: string
}

const props = defineProps<AvSelectProps>()

/**
 * Events emitted by the component.
 */
const emit = defineEmits<{
  /**
   * Emitted when an option is selected.
   * @param value Value (`string | number`) of the selected option.
   */
  (e: 'update:modelValue', value: string | number): void
}>()

const title = computed(() => {
  if (props.modelValue == null) {
    return props.defaultUnselectedText
  }
  const selected = props.options?.find(opt => String(opt.value) === String(props.modelValue))
  return selected ? selected.text : props.defaultUnselectedText
})
</script>

<template>
  <DsfrSelect
    v-bind="props"
    :title="title"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<style lang="scss" scoped>
:deep(.fr-select) {
  background-color: var(--other-background-base);
  border: 1px solid var(--stroke);
  color: var(--text1);
  box-shadow: none;
  border-radius: var(--radius-md);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%232929A2' d='M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z'/%3E%3C/svg%3E");
}

:deep(.fr-select:hover) {
  background-color: var(--dark-background-primary1);
  color: var(--other-background-base);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z'/%3E%3C/svg%3E");
}

:deep(.fr-select:hover) option {
  color: var(--text1);
  background-color: var(--other-background-base);
}
</style>
