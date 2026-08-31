<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails } from '@/common/components'
import TraceValorizedBadge from '@/common/components/badges/ValorizedBadge/ValorizedBadge.vue'
import TraceAiJustificationTextarea from '@/features/traces/components/interactions/inputs/TraceAiJustificationTextarea/TraceAiJustificationTextarea.vue'
import TraceFileUpload from '@/features/traces/components/interactions/inputs/TraceFileUpload/TraceFileUpload.vue'
import TraceNameInput from '@/features/traces/components/interactions/inputs/TraceNameInput/TraceNameInput.vue'
import TracePersonalNoteTextarea from '@/features/traces/components/interactions/inputs/TracePersonalNoteTextarea/TracePersonalNoteTextarea.vue'
import TraceAiUsageToggle from '@/features/traces/components/interactions/toggles/TraceAiUsageToggle/TraceAiUsageToggle.vue'
import { useTraceAttachmentFile } from '@/features/traces/composables/use-trace-file/use-trace-file'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface StudentDetailedTraceInformationProps {
  trace: TraceDetailDTO
}

const { trace } = defineProps<StudentDetailedTraceInformationProps>()

const { t } = useI18n()
const attachment = computed(() => trace.attachment)

const { attachmentFile, uploadDate } = useTraceAttachmentFile(attachment)

const traceFileUploadLabel = computed(() => {
  return `${t('global.documentLabel')} - ${t('student.traces.interactions.inputs.TraceFileUpload.addedOn', { date: uploadDate.value })}`
})

const authorTypeLabel = computed(() =>
  t(`student.traces.views.StudentToolsTracesView.studentTraceDetails.authorType.${trace.authorType}`)
)
</script>

<template>
  <div class="av-col av-gap-md av-px-xs">
    <TraceValorizedBadge
      :valorized="trace.valorized"
    />
    <div class="av-col av-row--md av-justify-between av-gap-md">
      <div class="av-col av-flex-fill av-gap-md">
        <TraceNameInput
          :model-value="trace.title"
          :required="false"
          disabled
        />
        <TraceFileUpload
          v-if="attachment"
          :label="traceFileUploadLabel"
          :model-value="attachmentFile"
          :valid-message="t('global.success.file.loaded')"
          disabled
        />
        <div
          v-else
          class="av-col"
        >
          <label
            id="trace-link-label"
            class="av-label"
          >
            <span class="b2-light">{{ t('student.traces.views.StudentToolsTracesView.studentTraceDetails.linkLabel') }}</span>
          </label>
          <a
            target="_blank"
            rel="noopener noreferrer"
            :href="trace.link"
            class="trace-link"
            aria-labelledby="trace-link-label"
          >
            {{ trace.link }}
          </a>
        </div>

        <div class="av-col av-flex-fill personal-note">
          <TracePersonalNoteTextarea
            :model-value="trace.personalNote"
            disabled
          />
        </div>
      </div>

      <div class="av-col av-flex-fill av-gap-md">
        <div
          class="av-col av-gap-xs indicators"
          data-testid="author-type"
        >
          <span class="b2-regular">
            {{ t('student.traces.views.StudentToolsTracesView.studentTraceDetails.authorType.label') }}
          </span>
          <AvIconText
            typography-class="b2-light"
            icon-color="var(--text2)"
            :icon="MDI_ICONS.CHECK"
            :text="authorTypeLabel"
            inline
          />
        </div>

        <div class="av-col av-gap-xs">
          <span class="b2-regular">
            {{ t('student.traces.views.StudentToolsTracesView.studentTraceDetails.iaDescription') }}
          </span>
          <TraceAiUsageToggle
            :model-value="!!trace.aiUseJustification"
            :description="t('student.traces.views.StudentToolsTracesView.studentTraceDetails.iaToggleLabel')"
            disabled
          />
          <TraceAiJustificationTextarea
            v-if="trace.aiUseJustification"
            :model-value="trace.aiUseJustification"
            :label-visible="false"
            disabled
          />
        </div>

        <div class="av-row av-justify-end">
          <CreationUpdateDateDetails
            :created-at="trace.createdAt"
            :updated-at="trace.updatedAt"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.personal-note :deep(.av-input textarea) {
  min-height: 14rem;
}

.trace-link {
  color: revert;
}
</style>
