<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { useDownloadAttachment } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { downloadBlob } from '@/common/utils/download/download'
import { useToasterStore } from '@/store'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbackTraceActionsProps {
  trace: TraceDetailDTO
}

const { trace } = defineProps<FeedbackTraceActionsProps>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage } = useToasterStore()

const { mutate: mutateDownloadAttachment } = useDownloadAttachment()

function downloadAttachment () {
  if (!trace.attachment) {
    return
  }
  mutateDownloadAttachment(
    { traceId: trace.id },
    {
      onError: (error: BaseApiException) => {
        addErrorMessage({
          title: t('global.errors.download'),
          description: getErrorMessage(error)
        })
      },
      onSuccess: data => downloadBlob(data, trace.attachment?.fileName)
    }
  )
}
</script>

<template>
  <AvButton
    v-if="trace.attachment"
    :icon="MDI_ICONS.DOWNLOAD_OUTLINE"
    :label="t('global.buttons.download')"
    data-testid="feedback-trace-actions-download-button"
    @click.stop="downloadAttachment"
  />
  <AvButton
    v-else-if="trace.link"
    :label="t('global.buttons.access')"
    :href="trace.link"
    data-testid="feedback-trace-actions-link-button"
  />
</template>
