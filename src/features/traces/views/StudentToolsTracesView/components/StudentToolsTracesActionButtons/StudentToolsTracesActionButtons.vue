<script setup lang="ts">
import type { TracesSummaryDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import { useTracesStore } from '@/features/traces/stores/traces.store'
import DeleteTracesModal from '@/features/traces/views/StudentToolsTracesView/components/DeleteTracesModal/DeleteTracesModal.vue'
import TracesActionsDropdown
  from '@/features/traces/views/StudentToolsTracesView/components/TracesActionsDropdown/TracesActionsDropdown.vue'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface StudentToolsTracesActionButtonsProps {
  tracesSummary?: TracesSummaryDTO
}

const { tracesSummary } = defineProps<StudentToolsTracesActionButtonsProps>()
const { t } = useI18n()
const tracesStore = useTracesStore()
const { showModal, displayModal, hideModal } = useModal()
</script>

<template>
  <div class="av-row av-justify-end av-gap-sm">
    <AvButton
      :label="t('student.traces.views.StudentToolsTracesView.studentToolsTracesActionButtons.addTrace')"
      variant="OUTLINED"
      :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
      small
      data-testid="add-trace-button"
      @click="tracesStore.displayCreateTraceDrawer"
    />
    <TracesActionsDropdown @delete-selected="displayModal" />
  </div>

  <DeleteTracesModal
    :show="showModal"
    :total-count="(tracesSummary?.associated ?? 0) + (tracesSummary?.unassociated ?? 0)"
    @cancel="hideModal"
    @deleted="hideModal"
  />
</template>
