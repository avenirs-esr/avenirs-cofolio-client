<script lang="ts" setup>
import type { TraceDetailDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { ConfirmationModal } from '@/common/components'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useDeleteTraceMutation } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useToasterStore } from '@/store'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { trace, show, onConfirmDelete, onClose } = defineProps<{
  trace: TraceDetailDTO
  show: boolean
  onConfirmDelete: () => void
  onClose: () => void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage } = useToasterStore()
const { onConfirmDeleteTrace, isDeleteTracePending } = useDeleteTrace()

function useDeleteTrace () {
  function onDeleteTraceError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.traces.views.StudentTraceView.errors.delete'),
      description: getErrorMessage(error)
    })
  }

  const deleteTraceMutation = useDeleteTraceMutation({
    onError: onDeleteTraceError,
    onSuccess: onConfirmDelete
  })

  function onConfirmDeleteTrace () {
    deleteTraceMutation.mutate({ tracesIds: [trace.id] })
  }

  return {
    onConfirmDeleteTrace,
    isDeleteTracePending: deleteTraceMutation.isPending,
  }
}
</script>

<template>
  <ConfirmationModal
    :show="show"
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
    <div class="av-col av-gap-sm">
      <span class="b2-bold av-text-text2">{{ t('student.traces.views.StudentTraceView.traceDeletionConfirmationModal.description') }}</span>
      <span class="b2-light av-text-text2">{{ t('student.traces.views.StudentTraceView.traceDeletionConfirmationModal.subdescription') }}</span>
    </div>
  </ConfirmationModal>
</template>
