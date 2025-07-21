<script lang="ts" setup>
import type { TraceViewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { useDeleteTraceMutation } from '@/features/student/queries'
import { useToasterStore } from '@/store'
import { AvButton, MDI_ICONS } from '@/ui'
import AvIconText from '@/ui/base/AvIconText/AvIconText.vue'
import AvModal from '@/ui/overlay/modals/AvModal/AvModal.vue'
import { useI18n } from 'vue-i18n'

const { trace, show, onSuccess, onClose } = defineProps<{
  trace: TraceViewDTO
  show: boolean
  onSuccess: () => void
  onClose: () => void
}>()

const { t } = useI18n()
const { addErrorMessage } = useToasterStore()
const { onConfirmDeleteTrace, isDeleteTracePending } = useDeleteTrace()

function useDeleteTrace () {
  function onDeleteTraceError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.views.studentToolsTracesView.errors.delete'),
      description: error.message,
      type: 'error',
    })
  }

  const deleteTraceMutation = useDeleteTraceMutation({
    onError: onDeleteTraceError,
    onSuccess
  })

  function onConfirmDeleteTrace () {
    deleteTraceMutation.mutate({ traceId: trace.id })
  }

  return {
    onConfirmDeleteTrace,
    isDeleteTracePending: deleteTraceMutation.isPending,
  }
}
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('global.buttons.cancel')"
    @close="onClose"
  >
    <template #header>
      <AvIconText
        :icon="MDI_ICONS.ATTACH_FILE"
        icon-color="var(--icon)"
        :text="trace.title"
        typography-class="n6"
      />
    </template>
    <div class="content-container">
      <span class="b2-bold">{{ t('student.views.studentToolsTracesView.traceDeletionConfirmationModal.description') }}</span>
      <span class="b2-light">{{ t('student.views.studentToolsTracesView.traceDeletionConfirmationModal.subdescription') }}</span>
    </div>
    <template #footer>
      <AvButton
        variant="DEFAULT"
        theme="PRIMARY"
        :label="t('global.buttons.confirm')"
        :icon="MDI_ICONS.ARROW_RIGHT"
        :is-loading="isDeleteTracePending"
        size="sm"
        :on-click="() => onConfirmDeleteTrace()"
      />
    </template>
  </AvModal>
</template>

<style lang="scss" scoped>
.content-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.b2-bold, .b2-light {
  color: var(--text2);
}
</style>
