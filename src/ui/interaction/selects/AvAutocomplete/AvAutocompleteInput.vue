<script setup lang="ts" generic="T extends AvAutocompleteOption = AvAutocompleteOption">
import type { Slot } from 'vue'
import type { AvAutocompleteOption } from './AvAutocomplete.types'
import { MDI_ICONS } from '@/ui'
import AvButton from '@/ui/interaction/buttons/AvButton/AvButton.vue'
import AvInput from '@/ui/interaction/inputs/AvInput/AvInput.vue'
import { debounce } from 'lodash-es'
import { useAutocompleteContext } from './AvAutocompleteContext'

const emit = defineEmits<{
  search: [query: string]
  clear: []
}>()

const slots = defineSlots<{
  requiredTip?: Slot
}>()

const {
  selectedItems,
  searchQuery,
  isOpen,
  props,
  inputId,
  handleBlur,
  getDisplayLabel
} = useAutocompleteContext<T>()

const inputRef = useTemplateRef<InstanceType<typeof AvInput>>('inputRef')

const displayValue = computed(() => {
  if (!props.multiSelect && selectedItems.value.length > 0) {
    return getDisplayLabel(selectedItems.value[0])
  }
  if (props.multiSelect && selectedItems.value.length > 0) {
    if (props.showSelectedSection) {
      return `${selectedItems.value.length} element(s) selected`
    }
    else {
      return selectedItems.value.map(getDisplayLabel).join(', ')
    }
  }
  return searchQuery.value
})

const placeholderText = computed(() => {
  return props.inputOptions?.placeholder || 'Search...'
})

const debouncedSearch = debounce((query: string) => {
  searchQuery.value = query
  emit('search', query)
}, props.debounceDelay)

function handleInput (value: string | number | null) {
  searchQuery.value = String(value || '')
  debouncedSearch(searchQuery.value)
}

function handleFocus () {
  isOpen.value = true
}

function handleClearSelection () {
  selectedItems.value = []
  searchQuery.value = ''
  emit('clear')
}

onUnmounted(() => {
  debouncedSearch.cancel()
})

defineExpose({
  inputRef,
  searchQuery: computed(() => searchQuery.value)
})
</script>

<template>
  <div class="av-autocomplete-input">
    <AvInput
      :id="inputId"
      ref="inputRef"
      :model-value="displayValue"
      :placeholder="placeholderText"
      v-bind="props.inputOptions"
      @update:model-value="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @click="handleFocus"
    >
      <template
        v-if="slots.requiredTip"
        #requiredTip
      >
        <component :is="slots.requiredTip" />
      </template>
    </AvInput>

    <div
      v-if="selectedItems.length > 0"
      class="av-autocomplete-input__suffix"
    >
      <AvButton
        label="Clear selected items"
        :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
        icon-only
        :icon-scale="0.8"
        size="sm"
        variant="DEFAULT"
        theme="SECONDARY"
        :on-click="handleClearSelection"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.av-autocomplete-input {
  position: relative;
}

.av-autocomplete-input__suffix {
  position: absolute;
  right: var(--spacing-xxs);
  top: 2.2rem;
  z-index: 2;
  display: flex;
  align-items: center;
  transform: translateY(-50%);
  pointer-events: none;

  & :deep(.av-button) {
    padding: 0 !important;
    margin: 0 !important;
    pointer-events: all;
  }
}

.av-autocomplete-input :deep(input) {
  padding-right: calc(var(--spacing-xs) * 3 + 1rem);
}
</style>
