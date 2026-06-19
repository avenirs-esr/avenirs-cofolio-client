<script lang="ts" setup>
import { EActivityStatus } from '@/api/avenir-esr'
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface MoreActionsDropdownProps {
  activityStatus: EActivityStatus
}

const { activityStatus } = defineProps<MoreActionsDropdownProps>()

const emit = defineEmits<{
  (e: 'deleteSelected'): void
}>()

enum MoreActionsEvents {
  DELETE = 'delete'
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: MoreActionsEvents.DELETE,
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('global.buttons.delete'),
    disabled: activityStatus !== EActivityStatus.DRAFT
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case MoreActionsEvents.DELETE:
      emit('deleteSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="t('staff.activities.views.ActivitiesView.MoreActionsDropdown.ariaLabel')"
    width="max-content"
    icon-only
    @item-selected="handleItemSelected"
  />
</template>
