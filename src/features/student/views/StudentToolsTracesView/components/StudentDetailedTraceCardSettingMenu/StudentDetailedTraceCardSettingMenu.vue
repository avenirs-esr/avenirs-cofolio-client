<script lang="ts" setup>
import type { TraceViewDTO } from '@/api/avenir-esr'
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

function onClickDelete () {
  emit('onTraceDelete', props.trace)
  emit('close')
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
      @click="onClickDelete"
    />
  </div>
</template>

<style lang="scss" scoped>
.student-detailed-trace-card-setting-menu {
  position: absolute;
  top: 6rem;
  right: 0.25rem;
  background: var(--background-dialog);
  border: 0.06rem solid var(--dark-background-primary2);
  border-radius: var(--radius-lg);
  box-shadow: 0 var(--spacing-xxs) var(--spacing-xs) rgba(0, 0, 0, 0.15);
  z-index: 20000;
  min-width: 14.688rem;
  padding:  var(--spacing-xs) 0.04rem;
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
