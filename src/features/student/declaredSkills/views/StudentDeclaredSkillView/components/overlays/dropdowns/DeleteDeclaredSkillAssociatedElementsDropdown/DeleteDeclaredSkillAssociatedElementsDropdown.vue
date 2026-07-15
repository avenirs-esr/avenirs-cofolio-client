<script lang="ts" setup>
import { ICONS } from '@/common/constants'
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredSkillAssociatedElementsDropdownProps {
  activitiesDisabled?: boolean
  disabled?: boolean
}

const { activitiesDisabled = false, disabled = false } = defineProps<DeleteDeclaredSkillAssociatedElementsDropdownProps>()

const emit = defineEmits<{
  (e: 'activitiesSelected'): void
}>()

enum DeleteDeclaredSkillAssociatedElementsDropdownEvents {
  ACTIVITIES = 'activities',
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: DeleteDeclaredSkillAssociatedElementsDropdownEvents.ACTIVITIES,
    icon: ICONS.ACTIVITY,
    label: t('global.associations.elementsToAssociate.activities'),
    disabled: disabled || activitiesDisabled,
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case DeleteDeclaredSkillAssociatedElementsDropdownEvents.ACTIVITIES:
      emit('activitiesSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    data-testid="delete-declared-skill-associated-elements-dropdown"
    :items="menuItems"
    :trigger-aria-label="`${t('global.buttons.delete')}...`"
    :trigger-label="`${t('global.buttons.delete')}...`"
    :trigger-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>
