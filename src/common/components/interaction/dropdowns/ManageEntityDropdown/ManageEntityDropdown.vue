<script setup lang="ts">
import type { Action, ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { moreActionConfig } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.config'
import { AvDropdown, type AvDropdownItem } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ManageEntityDropdownProps {
  entityName?: string
  actions: (Action | ActionItem)[]
  icon?: string
  iconOnly?: boolean
}

const { entityName, actions, icon, iconOnly = false } = defineProps<ManageEntityDropdownProps>()

const emit = defineEmits<{
  (e: 'actionSelected', action: Action): void
}>()

const { t } = useI18n()

const label = computed(() => {
  const base = t('global.buttons.manage')
  const name = entityName?.trim()
  return name ? `${base} ${name.toLowerCase()}` : base
})

const actionItemsMap = computed(() => new Map(
  actions.map((action) => {
    const item = typeof action === 'string' ? { type: action } : action
    return [item.type, item]
  }),
))

const actionItems = computed(() =>
  (Object.keys(moreActionConfig) as Action[])
    .filter(type => actionItemsMap.value.has(type))
    .map<AvDropdownItem>((type) => {
      const { labelKey, ...configs } = moreActionConfig[type]
      const { type: _type, ...options } = actionItemsMap.value.get(type)!

      return {
        ...options,
        ...configs,
        name: type,
        label: t(labelKey),
      }
    })
)

const triggerLabel = computed(() => iconOnly ? undefined : label.value)
</script>

<template>
  <AvDropdown
    :items="actionItems"
    :trigger-aria-label="label"
    :trigger-label="triggerLabel"
    :trigger-icon="icon"
    width="max-content"
    data-testid="manage-entity-dropdown"
    @item-selected="(itemName) => emit('actionSelected', itemName as Action)"
  />
</template>
