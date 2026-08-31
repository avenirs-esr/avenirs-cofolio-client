<script lang="ts" setup>
import type { EAssociationContextType } from '@/api/avenir-esr'
import {
  ASSOCIATION_TYPE_ICONS,
  ASSOCIATION_TYPE_ITEM_NAMES,
  ASSOCIATION_TYPE_LABEL_KEYS
} from '@/common/associations/constants/association-type.constants'
import { ICONS } from '@/common/constants'
import { AvDropdown, type AvDropdownItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export type AssociationElementsDropdownVariant = 'associate' | 'delete'

export interface AssociationElementsDropdownItem {
  type: EAssociationContextType
  disabled?: boolean
}

export interface AssociationElementsDropdownProps {
  variant: AssociationElementsDropdownVariant
  items: AssociationElementsDropdownItem[]
  disabled?: boolean
}

const { variant, items, disabled = false } = defineProps<AssociationElementsDropdownProps>()

const emit = defineEmits<{
  (e: 'select', type: EAssociationContextType): void
}>()

const { t } = useI18n()

const isAssociate = computed(() => variant === 'associate')

const triggerLabel = computed(() =>
  `${t(isAssociate.value ? 'global.buttons.associate' : 'global.buttons.delete')}...`)

const triggerIcon = computed(() =>
  isAssociate.value ? ICONS.ASSOCIATED : MDI_ICONS.TRASH_CAN_OUTLINE)

const triggerVariant = computed(() => isAssociate.value ? 'FLAT' : undefined)

const menuItems = computed<AvDropdownItem[]>(() => items.map(({ type, disabled: itemDisabled = false }) => ({
  name: ASSOCIATION_TYPE_ITEM_NAMES[type],
  icon: ASSOCIATION_TYPE_ICONS[type],
  label: t(ASSOCIATION_TYPE_LABEL_KEYS[type]),
  disabled: disabled || itemDisabled,
})))

function handleItemSelected (itemName: string) {
  const selected = items.find(({ type }) => ASSOCIATION_TYPE_ITEM_NAMES[type] === itemName)

  if (selected) {
    emit('select', selected.type)
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="triggerLabel"
    :trigger-label="triggerLabel"
    :trigger-icon="triggerIcon"
    :trigger-variant="triggerVariant"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>
