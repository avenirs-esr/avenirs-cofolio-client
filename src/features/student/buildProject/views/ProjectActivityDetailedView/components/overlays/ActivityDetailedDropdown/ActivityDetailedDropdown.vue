<script lang="ts" setup>
import type { EDeclaredActivityStatus } from '@/api/avenir-esr'
import { isDeclaredActivityUnsubscribed } from '@/common/activities/rules/activities.rules'
import { AvDropdown, MDI_ICONS, PH_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityDetailedDropdownProps {
  status: EDeclaredActivityStatus
}

const { status } = defineProps<ActivityDetailedDropdownProps>()

const emit = defineEmits<{
  (e: 'updateSelected'): void
  (e: 'unsubscribeSelected'): void
  (e: 'resubscribeSelected'): void
}>()

enum ActivityDetailedDropdownEvents {
  UPDATE = 'update',
  UNSUBSCRIBE = 'unsubscribe',
  RESUBSCRIBE = 'resubscribe',
}

const { t } = useI18n()

const isUnsubscribed = computed(() => isDeclaredActivityUnsubscribed(status))

const menuItems = computed(() => isUnsubscribed.value
  ? [
      {
        name: ActivityDetailedDropdownEvents.RESUBSCRIBE,
        icon: PH_ICONS.NOTE_PENCIL,
        label: t('student.buildProject.activities.buttons.resubscribe')
      }
    ]
  : [
      {
        name: ActivityDetailedDropdownEvents.UPDATE,
        icon: MDI_ICONS.PENCIL_OUTLINE,
        label: t('global.buttons.update')
      },
      {
        name: ActivityDetailedDropdownEvents.UNSUBSCRIBE,
        icon: MDI_ICONS.TRASH_CAN_OUTLINE,
        label: t('student.buildProject.activities.buttons.unsubscribe')
      }
    ])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case ActivityDetailedDropdownEvents.UPDATE:
      emit('updateSelected')
      break
    case ActivityDetailedDropdownEvents.UNSUBSCRIBE:
      emit('unsubscribeSelected')
      break
    case ActivityDetailedDropdownEvents.RESUBSCRIBE:
      emit('resubscribeSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="t('student.buildProject.activities.views.ProjectActivityDetailedView.ActivityDetailedDropdown.triggerLabel')"
    :trigger-label="t('student.buildProject.activities.views.ProjectActivityDetailedView.ActivityDetailedDropdown.triggerLabel')"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>
