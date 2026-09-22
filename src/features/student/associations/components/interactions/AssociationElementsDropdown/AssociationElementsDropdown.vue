<script lang="ts" setup>
import type { EAssociationContextType } from '@/api/avenir-esr'
import { ASSOCIATION_TYPE_ICONS } from '@/common/associations/constants/association-type.constants'
import { ICONS } from '@/common/constants'
import { ASSOCIATION_DROPDOWN_ITEM_NAMES } from '@/features/student/associations/constants/associations.constants'
import { AvDropdown, type AvDropdownItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export type AssociationElementsDropdownVariant = 'associate' | 'delete'

export interface AssociationElementsDropdownItem {
  type: EAssociationContextType
  disabled?: boolean
  disabledTooltip?: string
}

export interface AssociationElementsDropdownProps {
  variant: AssociationElementsDropdownVariant
  items: AssociationElementsDropdownItem[]
  disabled?: boolean
  disabledTooltip?: string
}

const { variant, items, disabled = false, disabledTooltip } = defineProps<AssociationElementsDropdownProps>()

const emit = defineEmits<{
  (e: 'select', type: EAssociationContextType): void
}>()

const { t } = useI18n()

const isAssociate = computed(() => variant === 'associate')

const triggerLabel = computed(() =>
  `${t(isAssociate.value ? 'global.buttons.associate' : 'global.buttons.delete')}...`)

const triggerIcon = computed(() =>
  isAssociate.value ? ICONS.ASSOCIATE : MDI_ICONS.TRASH_CAN_OUTLINE)

const triggerVariant = computed(() => isAssociate.value ? 'FLAT' : undefined)

const menuItems = computed<AvDropdownItem[]>(() => items.map(({ type, disabled: itemDisabled = false, disabledTooltip: itemDisabledTooltip }) => ({
  name: ASSOCIATION_DROPDOWN_ITEM_NAMES[type],
  icon: ASSOCIATION_TYPE_ICONS[type],
  label: t(`student.associations.contextTypes.${type}.dropdownLabel`),
  disabled: disabled || itemDisabled,
  disabledTooltip: disabled && disabledTooltip ? disabledTooltip : itemDisabledTooltip,
})))

function handleItemSelected (itemName: string) {
  const selected = items.find(({ type }) => ASSOCIATION_DROPDOWN_ITEM_NAMES[type] === itemName)

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
