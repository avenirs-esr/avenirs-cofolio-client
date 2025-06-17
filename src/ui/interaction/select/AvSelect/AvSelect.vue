<script setup lang="ts">
import { removeDuplicates } from '@/common/utils'
import { MDI_ICONS } from '@/ui/tokens'
import { DsfrTag } from '@gouvminint/vue-dsfr'

export interface AvSelectProps {
  options: string[] | number[]
  selected?: string | number | (string | number)[]
  multiple?: boolean
  label?: string
  labelColor?: string
  labelTypographyClass?: string
  handleSelectChange: (selected: string | number | (string | number)[]) => void
}

const {
  label,
  labelColor = 'var(--foreground-text2)',
  labelTypographyClass = 'b2-regular',
  options,
  selected = [],
  multiple = false,
  handleSelectChange
} = defineProps<AvSelectProps>()

const renderedOptions = computed(() => removeDuplicates<string | number>(options))

const selectedOptions = ref<(string | number)[]>(
  Array.isArray(selected) ? selected : selected !== undefined ? [selected] : []
)

const styleVars = computed(() => ({
  '--icon-path': `url(/assets/icons/check-circle.svg)`,
}))

function isOptionSelected (option: string | number) {
  return selectedOptions.value.includes(option)
}

function toggleOption (option: string | number) {
  if (multiple) {
    if (selectedOptions.value.includes(option)) {
      selectedOptions.value = selectedOptions.value.filter(selectedOption => selectedOption !== option)
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

function getIcon (option: string | number) {
  return isOptionSelected(option) ? MDI_ICONS.CHECK : undefined
}

function getDisabled (option: string | number) {
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
      :key="option"
      :style="styleVars"
      :class="{
        'fr-tag--selected': isOptionSelected(option),
        'fr-tag--disabled': getDisabled(option),
      }"
      :label="option.toString()"
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
  border: 1px solid var(--foreground-divider);
  border-radius: 0.5rem;
  color: var(--foreground-text2) !important;
  background: white !important;
  padding: 0.25rem 0.5rem !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
}

.fr-tag:hover {
  border: 1px solid var(--dark-background-primary1);
  color: white !important;
  background: var(--dark-background-primary1) !important;
}

.fr-tag--selected {
  border: 1px solid var(--dark-background-primary1);
  color: var(--dark-background-primary1) !important;
  background: white !important;
}

.fr-tag--selected:hover {
  border: 1px solid var(--dark-background-primary1);
  color: var(--dark-background-primary1) !important;
  background: white !important;
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
