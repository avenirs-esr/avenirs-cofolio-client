<script lang="ts" setup>
import type { TraceDetailDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { useDeleteTraceMutation } from '@/features/student/queries'
import { useToasterStore } from '@/store'
import { AvIconText, AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { trace, show, onConfirmDelete, onClose } = defineProps<{
  trace: TraceDetailDTO
  show: boolean
  onConfirmDelete: () => void
  onClose: () => void
}>()

const { t } = useI18n()
const { addErrorMessage } = useToasterStore()
const { onConfirmDeleteTrace, isDeleteTracePending } = useDeleteTrace()

function useDeleteTrace () {
  function onDeleteTraceError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.views.studentTraceView.errors.delete'),
      description: error.message
    })
  }

  const deleteTraceMutation = useDeleteTraceMutation({
    onError: onDeleteTraceError,
    onSuccess: onConfirmDelete
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
    :confirm-button-label="t('global.buttons.confirm')"
    :confirm-button-icon="MDI_ICONS.ARROW_RIGHT"
    :is-loading="isDeleteTracePending"
    @close="onClose"
    @confirm="() => onConfirmDeleteTrace()"
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
      <span class="b2-bold">{{ t('student.views.studentTraceView.traceDeletionConfirmationModal.description') }}</span>
      <span class="b2-light">{{ t('student.views.studentTraceView.traceDeletionConfirmationModal.subdescription') }}</span>
    </div>
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
