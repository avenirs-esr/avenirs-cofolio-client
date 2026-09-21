<script lang="ts" setup>
import { Action, type ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { useI18n } from 'vue-i18n'

export interface ActivityLibraryDropdownProps {
  unsubscribeDisabled?: boolean
}

const { unsubscribeDisabled = false } = defineProps<ActivityLibraryDropdownProps>()

const emit = defineEmits<{
  (e: 'unsubscribeSelected'): void
}>()

const { t } = useI18n()

const actions = computed<ActionItem[]>(() => [
  {
    type: Action.UNSUBSCRIBE,
    disabled: unsubscribeDisabled,
    disabledTooltip: t('student.activities.views.ActivitiesView.ActivityLibraryDropdown.unsubscribeDisabledTooltip')
  }
])

function handleActionSelected (action: Action) {
  switch (action) {
    case Action.UNSUBSCRIBE: return emit('unsubscribeSelected')
  }
}
</script>

<template>
  <ManageEntityDropdown
    :entity-name="t('student.activities.views.ActivitiesView.ActivityLibraryDropdown.entityName')"
    :actions
    data-testid="activity-library-dropdown"
    @action-selected="handleActionSelected"
  />
</template>
