<script lang="ts" setup>
import { ICONS } from '@/common/constants'
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredExperienceAssociatedElementsDropdownProps {
  tracesDisabled?: boolean
  disabled?: boolean
}

const { tracesDisabled = false, disabled = false } = defineProps<DeleteDeclaredExperienceAssociatedElementsDropdownProps>()

const emit = defineEmits<{
  (e: 'tracesSelected'): void
}>()

enum DeleteDeclaredExperienceAssociatedElementsDropdownEvents {
  TRACES = 'traces',
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: DeleteDeclaredExperienceAssociatedElementsDropdownEvents.TRACES,
    icon: ICONS.TRACES,
    label: t('global.associations.elementsToAssociate.traces'),
    disabled: disabled || tracesDisabled,
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case DeleteDeclaredExperienceAssociatedElementsDropdownEvents.TRACES:
      emit('tracesSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    data-testid="delete-declared-experience-associated-elements-dropdown"
    :items="menuItems"
    :trigger-aria-label="`${t('global.buttons.delete')}...`"
    :trigger-label="`${t('global.buttons.delete')}...`"
    :trigger-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>
