<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails } from '@/common/components'
import TraceFileUpload from '@/features/student/traces/components/interactions/inputs/TraceFileUpload/TraceFileUpload.vue'
import TraceIaJustificationTextarea from '@/features/student/traces/components/interactions/inputs/TraceIaJustificationTextarea/TraceIaJustificationTextarea.vue'
import TraceLinkInput from '@/features/student/traces/components/interactions/inputs/TraceLinkInput/TraceLinkInput.vue'
import TraceNameInput from '@/features/student/traces/components/interactions/inputs/TraceNameInput/TraceNameInput.vue'
import TracePersonalNoteTextarea from '@/features/student/traces/components/interactions/inputs/TracePersonalNoteTextarea/TracePersonalNoteTextarea.vue'
import { useTraceAttachmentFile } from '@/features/student/traces/composables/use-trace-file/use-trace-file'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface StudentDetailedTraceInformationProps {
  trace: TraceDetailDTO
}

const props = defineProps<StudentDetailedTraceInformationProps>()

const { t } = useI18n()
const attachment = computed(() => props.trace.attachment)

const { attachmentFile, uploadDate } = useTraceAttachmentFile(attachment)

const traceFileUploadLabel = computed(() => {
  return `${t('student.traces.interactions.inputs.TraceFileUpload.documentLabel')} - ${t('student.traces.interactions.inputs.TraceFileUpload.addedOn', { date: uploadDate.value })}`
})
</script>

<template>
  <div class="av-col av-gap-md av-px-xs">
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
        <TraceLinkInput
          v-else
          :model-value="trace.link"
          :label="t('student.traces.views.StudentToolsTracesView.studentTraceDetails.linkLabel')"
          :required="false"
          disabled
        />
        <div class="av-row av-justify-end">
          <CreationUpdateDateDetails
            :created-at="trace.createdAt"
            :updated-at="trace.updatedAt"
          />
        </div>
      </div>

      <div class="av-col av-flex-fill personal-note">
        <TracePersonalNoteTextarea
          :model-value="trace.personalNote"
          disabled
        />
      </div>
    </div>

    <div class="av-col av-row--md av-justify-between av-gap-md">
      <div class="av-col av-flex-fill av-gap-xs indicators">
        <AvIconText
          v-if="trace.isGroup"
          typography-class="b2-light"
          icon-color="var(--text2)"
          :icon="MDI_ICONS.PEOPLE_GROUP_OUTLINE"
          :text="t('student.traces.views.StudentToolsTracesView.studentTraceDetails.groupProduction')"
        />
        <AvIconText
          typography-class="b2-light"
          icon-color="var(--text2)"
          :icon="MDI_ICONS.CHECK"
          :text="t('student.traces.views.StudentToolsTracesView.studentTraceDetails.authenticProduction')"
        />
      </div>

      <div class="av-col av-flex-fill">
        <TraceAiUsageToggle
          :model-value="!!trace.aiUseJustification"
          :description="t('student.traces.views.StudentToolsTracesView.studentTraceDetails.iaToggleLabel')"
          disabled
        />
        <TraceIaJustificationTextarea
          v-if="trace.aiUseJustification"
          :model-value="trace.aiUseJustification"
          :label-visible="false"
          disabled
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.personal-note :deep(.av-input textarea) {
  min-height: 14rem;
}
</style>
