<script lang="ts" setup>
import type { TraceViewDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import TraceDeletionConfirmationModal from '@/features/student/views/StudentToolsTracesView/components/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import { AvButton, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  trace: TraceViewDTO
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'onTraceDelete', trace: TraceViewDTO): void
  (e: 'close'): void
}>()

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()

function onDeleteTraceSuccess () {
  hideModal()
  // Without setTimeout, the focus-trap is lost on close
  setTimeout(() => {
    emit('onTraceDelete', props.trace)
    emit('close')
  }, 0)
}
</script>

<template>
  <div
    v-if="show"
    class="student-detailed-trace-card-setting-menu"
  >
    <AvButton
      class="student-detailed-trace-card-setting-menu__item"
      :icon="MDI_ICONS.TRASH_CAN_OUTLINE"
      size="sm"
      theme="SECONDARY"
      :label="t('student.views.studentToolsTracesView.studentDetailedTraceModal.settings.delete')"
      :icon-scale="1.3"
      no-radius
      :on-click="() => displayModal()"
    />
  </div>
  <TraceDeletionConfirmationModal
    :trace="trace"
    :show="showModal"
    :on-success="() => onDeleteTraceSuccess()"
    :on-close="() => hideModal()"
  />
</template>

<style lang="scss" scoped>
.student-detailed-trace-card-setting-menu {
  position: absolute;
  top: 6rem;
  right: var(--spacing-xxs);
  background: var(--dialog);
  border: 0.06rem solid var(--dark-background-primary2);
  border-radius: var(--radius-lg);
  box-shadow: 0 var(--spacing-xxs) var(--spacing-xs) rgba(0, 0, 0, 0.15);
  z-index: 20000;
  min-width: 14.688rem;
  padding:  var(--spacing-xs) var(--spacing-none).04rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
}

.student-detailed-trace-card-setting-menu__item {
  display: flex;
  width: 100% !important;
  align-items: center;
  align-self: stretch;
}
</style>
