<script setup lang="ts" generic="T extends AvAutocompleteOption = AvAutocompleteOption">
import { AvAutocomplete, type AvAutocompleteOption, type AvAutocompleteProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface AutocompleteProps<T extends AvAutocompleteOption = AvAutocompleteOption>
  extends Omit<AvAutocompleteProps<T>, 'clearLabel'> { }

const props = defineProps<AutocompleteProps<T>>()
const { t } = useI18n()
const attrs = useAttrs()

const selectedItems = defineModel<T[]>({ default: () => [] })
const searchQuery = defineModel<string>('search', { default: '' })

const avAutocompleteProps = computed(() => ({
  ...attrs,
  ...props,
  clearLabel: t('global.AvAutoComplete.clearLabel'),
}))
</script>

<template>
  <AvAutocomplete
    v-model="selectedItems"
    v-model:search="searchQuery"
    v-bind="avAutocompleteProps"
  >
    <template
      v-if="$slots.requiredTip"
      #requiredTip
    >
      <slot name="requiredTip" />
    </template>
    <template
      v-if="$slots.item"
      #item="{ option, isSelected, toggle }"
    >
      <slot
        name="item"
        :option="option"
        :is-selected="isSelected"
        :toggle="toggle"
      />
    </template>
    <template
      v-if="$slots.selectedItem"
      #selectedItem="{ option, remove }"
    >
      <slot
        name="selectedItem"
        :option="option"
        :remove="remove"
      />
    </template>
    <template
      v-if="$slots.empty"
      #empty
    >
      <slot name="empty" />
    </template>
  </AvAutocomplete>
</template>
