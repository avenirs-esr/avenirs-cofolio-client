<script lang="ts" setup>
import { Action, type ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { useI18n } from 'vue-i18n'

export interface TraceSettingsDropdownProps {
  downloadDisabled?: boolean
}

const { downloadDisabled = false } = defineProps<TraceSettingsDropdownProps>()

const emit = defineEmits<{
  (e: 'associateSelected'): void
  (e: 'deleteSelected'): void
  (e: 'updateSelected'): void
  (e: 'downloadSelected'): void
}>()

const { t } = useI18n()

const actions = computed(() => {
  const items: (Action | ActionItem)[] = [
    Action.UPDATE,
    {
      type: Action.DOWNLOAD,
      disabled: downloadDisabled,
      disabledTooltip: t('student.traces.views.StudentTraceView.settings.downloadDisabledTooltip')
    },
    Action.DELETE,
  ]

  if (!__DEMO_MODE__) {
    items.push(Action.ASSOCIATE)
  }

  return items
})

function handleActionSelected (action: Action) {
  switch (action) {
    case Action.ASSOCIATE: return emit('associateSelected')
    case Action.UPDATE: return emit('updateSelected')
    case Action.DOWNLOAD: return emit('downloadSelected')
    case Action.DELETE: return emit('deleteSelected')
  }
}
</script>

<template>
  <ManageEntityDropdown
    :entity-name="t('student.traces.myTrace')"
    :actions
    data-testid="trace-settings-dropdown"
    @action-selected="handleActionSelected"
  />
</template>
