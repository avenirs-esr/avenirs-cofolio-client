<script lang="ts" setup>
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { useI18n } from 'vue-i18n'
import { EAssociationContextType } from '@/api/avenir-esr'
import ManageAssociableEntityDropdown from '@/common/components/interaction/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'

export interface TraceSettingsDropdownProps {
  downloadDisabled?: boolean
  elementId: string
  hasAssociations: boolean
}

const { elementId, hasAssociations, downloadDisabled = false } = defineProps<TraceSettingsDropdownProps>()

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

type AllowedActions = Action.UPDATE | Action.DOWNLOAD | Action.DELETE

const { t } = useI18n()

const ownActions = computed(() => {
  const items: (Action | ActionItem)[] = [
    Action.UPDATE,
    {
      type: Action.DOWNLOAD,
      disabled: downloadDisabled,
      disabledTooltip: t('student.traces.views.StudentTraceView.settings.downloadDisabledTooltip')
    },
    Action.DELETE,
  ]

  return items
})

function onAction (action: Action, handleAction: (a: Action) => void) {
  switch (action) {
    case Action.ASSOCIATE:
    case Action.DISSOCIATE:
      handleAction(action)
      break
    case Action.UPDATE:
      emit(Action.UPDATE)
      break
    case Action.DOWNLOAD:
      emit(Action.DOWNLOAD)
      break
    case Action.DELETE:
      emit(Action.DELETE)
      break
  }
}
</script>

<template>
  <ManageAssociableEntityDropdown
    :context-type="EAssociationContextType.TRACE"
    :element-id="elementId"
    :has-associations="hasAssociations"
  >
    <template #default="{ associateAction, dissociateAction, handleAction }">
      <ManageEntityDropdown
        data-testid="trace-settings-dropdown"
        :entity-name="t('student.traces.myTrace')"
        width="max-content"
        :actions="[...ownActions, associateAction, dissociateAction]"
        @action-selected="(action) => onAction(action, handleAction)"
      />
    </template>
  </ManageAssociableEntityDropdown>
</template>
