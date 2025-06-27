<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { removeDuplicates } from '@/common/utils'
import { MDI_ICONS } from '@/ui/tokens'

export interface AvTagPickerOption {
  label: string
  value: string
}

interface AvTagPickerBaseProps {
  options: AvTagPickerOption[]
  label?: string
  labelColor?: string
  labelTypographyClass?: string
}

interface AvTagPickerSingleProps extends AvTagPickerBaseProps {
  multiple?: false
  selected?: AvTagPickerOption
  handleSelectChange: (selected: AvTagPickerOption) => void
}

interface AvTagPickerMultipleProps extends AvTagPickerBaseProps {
  multiple: true
  selected?: AvTagPickerOption[]
  handleSelectChange: (selected: AvTagPickerOption[]) => void
}

export type AvTagPickerProps = AvTagPickerSingleProps | AvTagPickerMultipleProps

const props = withDefaults(defineProps<AvTagPickerProps>(), {
  labelColor: 'var(--text2)',
  labelTypographyClass: 'b2-regular',
})

const {
  label,
  labelColor,
  labelTypographyClass,
  options,
  selected,
  multiple,
  handleSelectChange
} = props

const renderedOptions: ComputedRef<AvTagPickerOption[]> = computed(() => removeDuplicates<AvTagPickerOption>(options))

function getSelectedOptions (selected?: AvTagPickerOption | AvTagPickerOption[]): AvTagPickerOption[] {
  if (!selected) {
    return []
  }
  if (Array.isArray(selected)) {
    return selected
  }
  return [selected]
}

const selectedOptions = ref<AvTagPickerOption[]>(getSelectedOptions(selected))

function isOptionSelected (option: AvTagPickerOption): boolean {
  return selectedOptions.value.some(selectedOption => selectedOption.value === option.value)
}

function toggleOption (option: AvTagPickerOption): void {
  if (multiple) {
    const isSelected = isOptionSelected(option)
    if (isSelected) {
      selectedOptions.value = selectedOptions.value.filter(
        selectedOption => selectedOption.value !== option.value
      )
    }
    else {
      selectedOptions.value.push(option)
    }
    handleSelectChange([...selectedOptions.value])
  }
  else {
    selectedOptions.value = [option]
    handleSelectChange(option)
  }
}

function getIcon (option: AvTagPickerOption): string | undefined {
  return isOptionSelected(option) ? MDI_ICONS.CHECK : undefined
}

function getDisabled (option: AvTagPickerOption): boolean {
  return isOptionSelected(option) && !multiple
}
</script>

<template>
  <div class="av-select-container">
    <span
      v-if="label"
      class="av-select-label"
      :class="[labelTypographyClass]"
    >
      {{ label }}
    </span>

    <DsfrTag
      v-for="option in renderedOptions"
      :key="option.value"
      :class="{
        'fr-tag--selected': isOptionSelected(option),
        'fr-tag--disabled': getDisabled(option),
      }"
      :label="option.label"
      :icon="getIcon(option)"
      :disabled="getDisabled(option)"
      selectable
      :selected="isOptionSelected(option)"
      @select="() => toggleOption(option)"
    />
  </div>
</template>

<style lang="scss" scoped>
.av-select-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.av-select-label {
  color: v-bind('labelColor');
}

.fr-tag {
  border: 1px solid var(--divider);
  border-radius: 0.5rem;
  color: var(--text2) !important;
  background: var(--other-background-base) !important;
  padding: 0.25rem 0.5rem !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
}

.fr-tag:hover {
  border: 1px solid var(--dark-background-primary1);
  color: var(--other-background-base) !important;
  background: var(--dark-background-primary1) !important;
}

.fr-tag--selected {
  border: 1px solid var(--dark-background-primary1);
  color: var(--dark-background-primary1) !important;
  background: var(--other-background-base) !important;
}

.fr-tag--selected:hover {
  border: 1px solid var(--dark-background-primary1);
  color: var(--dark-background-primary1) !important;
  background: var(--other-background-base) !important;
}

.fr-tag--selected::after {
  content: '';
  mask: none !important;
  background: none !important;
}

.fr-tag--disabled {
  cursor: pointer;
  pointer-events: none;
}
</style>
