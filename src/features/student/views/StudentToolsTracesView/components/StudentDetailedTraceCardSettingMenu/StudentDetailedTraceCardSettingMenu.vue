<script lang="ts" setup>
import type { TraceViewDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import TraceDeletionConfirmationModal from '@/features/student/views/StudentToolsTracesView/components/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import UpdateTraceModal from '@/features/student/views/StudentToolsTracesView/components/UpdateTraceModal/UpdateTraceModal.vue'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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
const {
  showModal: showDeleteModal,
  displayModal: displayDeleteModal,
  hideModal: hideDeleteModal
} = useModal()
const {
  showModal: showUpdateModal,
  displayModal: displayUpdateModal,
  hideModal: hideUpdateModal
} = useModal()

const menuItems = computed(() => [
  {
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('student.views.studentToolsTracesView.studentDetailedTraceModal.settings.delete'),
    onClick: () => displayDeleteModal()
  },
  {
    icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE,
    label: t('student.views.studentToolsTracesView.studentDetailedTraceModal.settings.assign'),
    onClick: () => {}
  },
  {
    icon: MDI_ICONS.PENCIL_OUTLINE,
    label: t('student.views.studentToolsTracesView.studentDetailedTraceModal.settings.update'),
    onClick: () => displayUpdateModal()
  }
])

function onDeleteTraceSuccess () {
  hideDeleteModal()
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
      v-for="menuItem of menuItems"
      :key="menuItem.label"
      class="student-detailed-trace-card-setting-menu__item"
      :icon="menuItem.icon"
      size="sm"
      theme="SECONDARY"
      :label="menuItem.label"
      :aria-label="menuItem.label"
      :icon-scale="1.3"
      no-radius
      @click="menuItem.onClick"
    />
  </div>
  <TraceDeletionConfirmationModal
    :trace="trace"
    :show="showDeleteModal"
    :on-confirm-delete="() => onDeleteTraceSuccess()"
    :on-close="() => hideDeleteModal()"
  />
  <UpdateTraceModal
    :trace="trace"
    :show="showUpdateModal"
    :on-close="() => hideUpdateModal()"
  />
</template>

<style lang="scss" scoped>
.student-detailed-trace-card-setting-menu {
  position: absolute;
  top: 4.2rem;
  right: var(--spacing-xxs);
  background: var(--dialog);
  border: 0.06rem solid var(--dark-background-primary2);
  border-radius: var(--radius-lg);
  box-shadow: 0 var(--spacing-xxs) var(--spacing-xs) rgba(0, 0, 0, 0.15);
  z-index: 20000;
  min-width: 14.688rem;
  padding:  var(--spacing-xs) var(--spacing-none);
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

  &:first-child {
    border-radius: var(--radius-sm) var(--radius-sm) 0 0 !important;
  }

  &:last-child {
    border-radius: 0 0 var(--radius-sm) var(--radius-sm) !important;
  }
}
</style>
