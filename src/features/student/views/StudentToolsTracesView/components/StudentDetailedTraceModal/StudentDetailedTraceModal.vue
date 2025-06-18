<script setup lang="ts">
import type { TraceViewDTO } from '@/api/avenir-esr'
import { AvModal } from '@/ui'
import { useI18n } from 'vue-i18n'

const {
  trace,
  showModal,
  onClose
} = defineProps<{ trace: TraceViewDTO, showModal: boolean, onClose: () => void }>()

const { t } = useI18n()
</script>

<template>
  <AvModal
    :title="t('student.views.studentToolsTracesView.studentDetailedTraceModal.title', { trace: trace.title })"
    :opened="showModal"
    :close-button-label="t('student.views.studentToolsTracesView.studentDetailedTraceModal.buttons.close')"
    :close-button-title="t('student.views.studentToolsTracesView.studentDetailedTraceModal.buttons.close')"
    @close="onClose"
  >
    <div>
      Placeholder...
    </div>
  </AvModal>
</template>

<style lang="scss" scoped></style>
