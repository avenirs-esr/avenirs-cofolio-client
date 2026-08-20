<script lang="ts" setup>
import { EActivityStatus } from '@/api/avenir-esr'
import { AvDropdown, MDI_ICONS, MS_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface MoreActionsDropdownProps {
  activityStatus: EActivityStatus
}

const { activityStatus } = defineProps<MoreActionsDropdownProps>()

const emit = defineEmits<{
  (e: 'deleteSelected'): void
  (e: 'unpublishSelected'): void
  (e: 'navigateToFeedbacksSelected'): void
  (e: 'cloneSelected'): void
}>()

enum MoreActionsEvents {
  DELETE = 'delete',
  UNPUBLISH = 'unpublish',
  NAVIGATE_TO_FEEDBACKS = 'navigateToFeedbacks',
  CLONE = 'clone'
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: MoreActionsEvents.NAVIGATE_TO_FEEDBACKS,
    icon: MDI_ICONS.ARROW_RIGHT,
    label: t('staff.activities.views.ActivitiesView.MoreActionsDropdown.navigateToFeedbacks'),
    disabled: activityStatus !== EActivityStatus.PUBLISHED
  },
  {
    name: MoreActionsEvents.UNPUBLISH,
    icon: RI_ICONS.EYE_OFF_LINE,
    label: t('global.buttons.unpublish'),
    disabled: activityStatus !== EActivityStatus.PUBLISHED
  },
  {
    name: MoreActionsEvents.DELETE,
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('global.buttons.delete'),
    disabled: activityStatus !== EActivityStatus.DRAFT
  },
  {
    name: MoreActionsEvents.CLONE,
    icon: MS_ICONS.CONTENT_COPY_OUTLINE,
    label: t('global.buttons.clone'),
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case MoreActionsEvents.DELETE:
      emit('deleteSelected')
      break
    case MoreActionsEvents.NAVIGATE_TO_FEEDBACKS:
      emit('navigateToFeedbacksSelected')
      break
    case MoreActionsEvents.UNPUBLISH:
      emit('unpublishSelected')
      break
    case MoreActionsEvents.CLONE:
      emit('cloneSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    data-testid="more-actions-dropdown"
    :items="menuItems"
    :trigger-aria-label="t('staff.activities.views.ActivitiesView.MoreActionsDropdown.ariaLabel')"
    width="max-content"
    icon-only
    @item-selected="handleItemSelected"
  />
</template>
