<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import {
  TraceAiUsageToggle,
  TraceFileUpload,
  TraceIaJustificationTextarea,
  TraceNameInput,
  TracePersonalNoteTextarea
} from '@/features/student/components/traces'
import { useTraceAttachmentFile } from '@/features/student/composables'
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
  return `${t('student.traces.traceFileUpload.documentLabel')} - ${t('student.traces.traceFileUpload.addedOn', { date: uploadDate.value })}`
}
)
</script>

<template>
  <div class="student-detailed-trace-information">
    <div class="student-detailed-trace-information__content">
      <div class="student-detailed-trace-information__row">
        <div class="student-detailed-trace-information__left-column">
          <TraceNameInput
            :model-value="trace.title"
            :required="false"
            disabled
          />

          <div class="student-detailed-trace-information__upload-section">
            <TraceFileUpload
              :label="traceFileUploadLabel"
              :model-value="attachmentFile"
              :valid-message="t('global.success.file.loaded')"
              disabled
            />
          </div>
        </div>

        <div class="student-detailed-trace-information__right-column">
          <TracePersonalNoteTextarea
            :model-value="trace.personalNote"
            disabled
          />
        </div>
      </div>

      <div class="student-detailed-trace-information__row">
        <div class="student-detailed-trace-information__left-column">
          <div class="student-detailed-trace-information__indicators">
            <AvIconText
              v-if="trace.isGroup"
              typography-class="b2-light"
              icon-color="var(--text2)"
              :icon="MDI_ICONS.PEOPLE_GROUP_OUTLINE"
              :text="t('student.views.studentToolsTracesView.studentTraceDetails.groupProduction')"
            />
            <AvIconText
              typography-class="b2-light"
              icon-color="var(--text2)"
              :icon="MDI_ICONS.CHECK"
              :text="t('student.views.studentToolsTracesView.studentTraceDetails.authenticProduction')"
            />
          </div>
        </div>

        <div class="student-detailed-trace-information__right-column">
          <div class="student-detailed-trace-information__ia">
            <TraceAiUsageToggle
              :model-value="!!trace.aiUseJustification"
              :description="t('student.views.studentToolsTracesView.studentTraceDetails.iaToggleLabel')"
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
    </div>
  </div>
</template>

<style scoped>
.student-detailed-trace-information {
  padding: var(--spacing-md) var(--spacing-xs);
}

.student-detailed-trace-information__content {
  display: grid;
  gap: var(--spacing-md);
}

.student-detailed-trace-information__row {
  display: flex;
  gap: var(--spacing-lg);
  align-items: stretch;
}

.student-detailed-trace-information__left-column,
.student-detailed-trace-information__right-column {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--spacing-md);
}

.student-detailed-trace-information__row:first-child .student-detailed-trace-information__right-column :deep(.av-input textarea) {
  flex: 1;
  min-height: 14rem;
}

.student-detailed-trace-information__upload-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxxs);
}

.student-detailed-trace-information__indicators {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.student-detailed-trace-information__ia {
  display: flex;
  flex-direction: column;
}
</style>
