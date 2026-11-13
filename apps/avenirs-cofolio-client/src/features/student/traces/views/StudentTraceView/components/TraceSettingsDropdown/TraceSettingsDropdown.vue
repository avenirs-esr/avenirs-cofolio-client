<script lang="ts" setup>
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageAssociableEntityDropdown from '@/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'

export interface TraceSettingsDropdownProps {
  traceId: string
  downloadDisabled?: boolean
}

const { downloadDisabled = false } = defineProps<TraceSettingsDropdownProps>()

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

type AllowedActions = Action.UPDATE | Action.DOWNLOAD | Action.DELETE

const { t } = useI18n()

const actions = computed(() => {
  const items: (Action | ActionItem)[] = [
    Action.UPDATE,
    {
      type: Action.DOWNLOAD,
      disabled: downloadDisabled,
      disabledTooltip: t('student.traces.views.StudentTraceView.settings.downloadDisabledTooltip')
    },
    Action.DELETE
  ]

  return items
})
</script>

<template>
  <ManageAssociableEntityDropdown
    :actions="actions"
    :entity-name="t('student.traces.myTrace')"
    :element-id="traceId"
    :context-type="EAssociationContextType.TRACE"
    data-testid="trace-settings-dropdown"
    @update="() => emit(Action.UPDATE)"
    @download="() => emit(Action.DOWNLOAD)"
    @delete="() => emit(Action.DELETE)"
  />
</template>
