<script lang="ts" setup>
import { DsfrRadioButton, DsfrRadioButtonSet } from '@gouvminint/vue-dsfr'
import { type Slot, useSlots } from 'vue'

/**
 * AvRadioButtonSet component props.
 */
export interface AvRadioButtonSetProps {
  /**
   * Name of the radio group, applied to each radio `<input name>`.
   * Used for form submission and accessibility.
   */
  name: string

  /**
   * Label (legend) for the radio group, rendered visually as a title.
   * Helps screen readers understand the group context.
   */
  legend?: string

  /**
   * Current selected value in the radio group.
   * Must match one of the options values.
   */
  modelValue: string | number | boolean | undefined

  /**
   * If true, disables all radio buttons in the group.
   */
  disabled?: boolean

  /**
   * If true, marks the group as required and shows a required indicator.
   */
  required?: boolean

  /**
   * If true, displays the radio buttons in compact (small) mode.
   */
  small?: boolean

  /**
   * If true, displays the radio buttons inline (horizontally).
   */
  inline?: boolean

  /**
   * Optional global error message displayed below the group.
   * Used to indicate a validation error.
   */
  errorMessage?: string

  /**
   * Optional global valid message displayed below the group.
   * Used to confirm successful validation.
   */
  validMessage?: string

  /**
   * Optional hint text displayed below the legend.
   * Provides guidance or extra information.
   */
  hint?: string
}

const props = defineProps<AvRadioButtonSetProps>()

const emit = defineEmits<{
  /**
   * Emitted when the selected radio button changes.
   *
   * @event update:modelValue
   * @param value The newly selected value.
   * Can be a `string`, `number`, or `boolean`, depending on the bound data.
   */
  (e: 'update:modelValue', value: string | number | boolean): void
}>()

defineSlots<{
  /**
   * Default slot to pass in one or more `AvRadioButton` components.
   *
   * Each `AvRadioButton` defines the props and content for a single radio option.
   * The content of each button will be injected into the `label` slot of `DsfrRadioButton`.
   *
   * @slot default
   */
  default?: Slot
}>()

const slots = useSlots()
const radios = computed(() => slots.default?.() || [])

const selected = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  selected.value = val
})

watch(selected, (val) => {
  if (val) {
    emit('update:modelValue', val)
  }
})
</script>

<template>
  <DsfrRadioButtonSet
    v-bind="props"
    :model-value="selected"
  >
    <DsfrRadioButton
      v-for="(radio, index) in radios"
      :key="index"
      v-model="selected"
      :value="radio.props?.value"
      :disabled="radio.props?.disabled ?? props.disabled"
      :small="props.small"
      :inline="props.inline"
    >
      <template #label>
        <component :is="(radio.children as Record<string, unknown>).default" />
      </template>
    </DsfrRadioButton>
  </DsfrRadioButtonSet>
</template>
