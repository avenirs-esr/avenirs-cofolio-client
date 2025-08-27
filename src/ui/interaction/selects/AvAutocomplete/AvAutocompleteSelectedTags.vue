<script setup lang="ts" generic="T extends AvAutocompleteOption = AvAutocompleteOption">
import type { Slot } from 'vue'
import type { AvAutocompleteOption } from './AvAutocomplete.types'
import { MDI_ICONS } from '@/ui'
import AvButton from '@/ui/interaction/buttons/AvButton/AvButton.vue'
import { useAutocompleteContext } from './AvAutocompleteContext'

const slots = defineSlots<{
  selectedItem?: Slot<{ option: T, remove: () => void }>
}>()

const {
  selectedItems,
  props,
  getOptionId,
  getDisplayLabel
} = useAutocompleteContext<T>()

function removeOption (option: T) {
  const currentSelection = selectedItems.value
  const optionId = getOptionId(option)
  selectedItems.value = currentSelection.filter(
    (selected: T) => getOptionId(selected) !== optionId
  )
}
</script>

<template>
  <div
    v-if="props.multiSelect && selectedItems.length > 0 && props.showSelectedSection"
    class="av-autocomplete-selected-tags"
  >
    <div
      v-for="option in selectedItems"
      :key="getOptionId(option)"
      class="av-autocomplete-selected-tags__item"
    >
      <slot
        v-if="slots.selectedItem"
        name="selectedItem"
        :option="option"
        :remove="() => removeOption(option)"
      />
      <AvButton
        v-else
        :label="getDisplayLabel(option)"
        :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
        icon-right
        size="sm"
        variant="OUTLINED"
        theme="SECONDARY"
        :on-click="() => removeOption(option)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.av-autocomplete-selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
}

.av-autocomplete-selected-tags__item {
  display: inline-flex;
}
</style>
