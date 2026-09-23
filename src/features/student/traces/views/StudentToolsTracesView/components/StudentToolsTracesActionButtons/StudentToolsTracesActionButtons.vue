<script setup lang="ts">
import type { TracesSummaryDTO } from '@/api/avenir-esr'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { useModal } from '@/common/composables'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import DeleteTracesModal from '@/features/student/traces/views/StudentToolsTracesView/components/DeleteTracesModal/DeleteTracesModal.vue'
import { useI18n } from 'vue-i18n'

export interface StudentToolsTracesActionButtonsProps {
  tracesSummary?: TracesSummaryDTO
}

const { tracesSummary } = defineProps<StudentToolsTracesActionButtonsProps>()
const { t } = useI18n()
const tracesStore = useTracesStore()
const { modalOpened, openModal, closeModal } = useModal()

const actions = computed<Action[]>(() => [Action.ADD, Action.DELETE])

function handleActionSelected (action: Action) {
  switch (action) {
    case Action.ADD:
      tracesStore.displayCreateTraceDrawer()
      break
    case Action.DELETE:
      openModal()
      break
  }
}
</script>

<template>
  <ManageEntityDropdown
    :actions="actions"
    :entity-name="t('student.traces.views.StudentToolsTracesView.studentToolsTracesActionButtons.entityName')"
    data-testid="manage-traces-dropdown"
    @action-selected="handleActionSelected"
  />

  <DeleteTracesModal
    :opened="modalOpened"
    :total-count="(tracesSummary?.associated ?? 0) + (tracesSummary?.unassociated ?? 0)"
    @cancel="closeModal"
    @deleted="closeModal"
  />
</template>
