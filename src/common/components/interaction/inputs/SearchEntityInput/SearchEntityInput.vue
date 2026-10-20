<script lang="ts" setup>
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'

export interface SearchEntityInputProps {
  /**
   * The name of the entity being searched.
   * @example "a group", "a user", "an organization"
   */
  entityName: string

  /**
   * The placeholder text for the entity search input.
   * If not provided, fallback to the entityName
   * @example "a group name", "a user name or email", "an organization name"
   */
  entityPlaceholder?: string
}

const { entityName, entityPlaceholder } = defineProps<SearchEntityInputProps>()

const modelValue = defineModel<string>({ default: '' })

const { t } = useI18n()

const debouncedUpdateModelValue = debounce((payload: string) => {
  modelValue.value = payload
}, 350)

function handleModelValueChange (value: string | number | null | undefined) {
  const stringValue = value?.toString() ?? ''
  debouncedUpdateModelValue(stringValue)
}

const label = computed(() => t('global.inputs.SearchEntityInput.label', { entityName }))
const placeholder = computed(() => t('global.inputs.SearchEntityInput.placeholder', { entityPlaceholder: entityPlaceholder ?? entityName }))
</script>

<template>
  <Input
    :model-value="modelValue"
    :label="label"
    :aria-label="label"
    class="search-entity-input"
    :placeholder="placeholder"
    width="var(--dimension-8xl)"
    label-visible
    type="search"
    :prefix-icon="MDI_ICONS.MAGNIFY"
    data-testid="search-entity-input"
    @update:model-value="handleModelValueChange"
  />
</template>
