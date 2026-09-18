<script setup lang="ts">
import type { Action, ActionItem } from '@/common/components/interaction/dropdowns/MoreActionsDropdown/MoreActionsDropdown.types'
import { moreActionConfig } from '@/common/components/interaction/dropdowns/MoreActionsDropdown/MoreActionsDropdown.config'
import { AvDropdown, type AvDropdownItem } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface MoreActionsDropdownProps {
  entityName?: string
  actions: (Action | ActionItem)[]
  icon?: string
  iconOnly?: boolean
}

const { entityName, actions, icon, iconOnly = false } = defineProps<MoreActionsDropdownProps>()

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
      const config = moreActionConfig[type]
      const actionOptions = actionItemsMap.value.get(type)!

      return {
        name: type,
        icon: config.icon,
        label: t(config.labelKey),
        disabled: actionOptions.disabled
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
    data-testid="more-actions-dropdown"
    @item-selected="(itemName) => emit('actionSelected', itemName as Action)"
  />
</template>
