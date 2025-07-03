<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { MDI_ICONS } from '@/ui/tokens/icons'
import { removeDuplicates } from '@/ui/utils'

/**
 * Représente une option dans le composant AvTagPicker.
 */
export interface AvTagPickerOption {
  /**
   * Libellé affiché pour l'option.
   */
  label: string

  /**
   * Valeur associée à l'option.
   */
  value: string
}

/**
 * Props de base communes au AvTagPicker en mode simple ou multiple.
 */
interface AvTagPickerBaseProps {
  /**
   * Liste des options disponibles dans le picker.
   */
  options: AvTagPickerOption[]

  /**
   * Libellé affiché au-dessus du picker.
   */
  label?: string

  /**
   * Couleur du libellé.
   * @default 'var(--text2)'
   */
  labelColor?: string

  /**
   * Classe de typographie appliquée au libellé.
   * @default 'b2-regular'
   */
  labelTypographyClass?: string
}

/**
 * Props pour le AvTagPicker en mode sélection simple.
 */
interface AvTagPickerSingleProps extends AvTagPickerBaseProps {
  /**
   * Mode multiple désactivé.
   * @default false
   */
  multiple?: false

  /**
   * Option sélectionnée.
   */
  selected?: AvTagPickerOption

  /**
   * Méthode appelée lors du changement de sélection.
   * @param selected L'option sélectionnée.
   */
  handleSelectChange: (selected: AvTagPickerOption) => void
}

/**
 * Props pour le AvTagPicker en mode sélection multiple.
 */
interface AvTagPickerMultipleProps extends AvTagPickerBaseProps {
  /**
   * Active le mode sélection multiple.
   */
  multiple: true

  /**
   * Options sélectionnées.
   */
  selected?: AvTagPickerOption[]

  /**
   * Méthode appelée lors du changement de sélection.
   * @param selected Les options sélectionnées.
   */
  handleSelectChange: (selected: AvTagPickerOption[]) => void
}

/**
 * Props du composant AvTagPicker, pouvant être en mode simple ou multiple.
 */
export type AvTagPickerProps = AvTagPickerSingleProps | AvTagPickerMultipleProps

const props = withDefaults(defineProps<AvTagPickerProps>(), {
  labelColor: 'var(--text2)',
  labelTypographyClass: 'b2-regular',
})

const {
  label,
  labelColor,
  labelTypographyClass,
  selected,
  multiple,
  handleSelectChange
} = props

const renderedOptions: ComputedRef<AvTagPickerOption[]> = computed(() => removeDuplicates<AvTagPickerOption>(props.options))

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

watch(() => props.selected, (newSelected) => {
  selectedOptions.value = getSelectedOptions(newSelected)
}, { immediate: true })
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

    <div
      v-for="option in renderedOptions"
      :key="option.value"
      class="tag-wrapper"
    >
      <DsfrTag
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
  </div>
</template>

<style lang="scss" scoped>
.av-select-container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0.5rem;
  text-align: center;
}

.av-select-label {
  display: flex;
  align-items: center;
  color: v-bind('labelColor');
}

.tag-wrapper {
  flex: 1 1 0;
  display: flex;
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
  flex: 1 !important;
  justify-content: center !important;
  text-align: center !important;
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
