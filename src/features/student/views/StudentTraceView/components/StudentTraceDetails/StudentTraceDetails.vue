<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import type { AvLocale } from '@/types'
import { TraceFileUpload, TraceIaJustificationTextarea, TraceNameInput, TracePersonalNoteTextarea } from '@/features/student/components/inputs'
import { AvIconText, AvToggle, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { format } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import { useI18n } from 'vue-i18n'

interface StudentDetailedTraceInformationProps {
  trace: TraceDetailDTO
}

const props = defineProps<StudentDetailedTraceInformationProps>()

const { t, locale } = useI18n()

function formatDate (date: string) {
  const currentLocale: AvLocale = locale.value as AvLocale
  const createdAtDate = new Date(date)
  return format(createdAtDate, 'dd MMMM yyyy à HH:mm', {
    locale: currentLocale === 'fr' ? fr : enUS
  })
}
const formattedTraceCreationDate = computed(() => formatDate(props.trace.createdAt))
const formattedUploadDate = computed(() => formatDate(props.trace.attachment.uploadedAt))

const traceAttachmentFile = computed(() => {
  return {
    name: props.trace.attachment.fileName,
    size: props.trace.attachment.fileSize
  } as File
})
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
            <div class="caption-regular">
              {{ t('student.views.studentToolsTracesView.studentDetailedTraceModal.studentTraceDetails.documentLabel') }} - {{ t('student.views.studentToolsTracesView.studentDetailedTraceModal.studentTraceDetails.addedOn', { date: formattedUploadDate }) }}
            </div>
            <TraceFileUpload
              :model-value="traceAttachmentFile"
              :aria-label="t('student.views.studentToolsTracesView.studentDetailedTraceModal.studentTraceDetails.documentLabel')"
              delete-button-label=""
              disabled
            />
            <div class="student-detailed-trace-information__file-info">
              <div class="b2-light student-detailed-trace-information__upload-date">
                {{
                  t('student.views.studentToolsTracesView.studentDetailedTraceModal.studentTraceDetails.addedOn', { date: formattedTraceCreationDate })
                }}
              </div>
            </div>
          </div>
        </div>

        <div class="student-detailed-trace-information__right-column">
          <TracePersonalNoteTextarea
            :model-value="trace.personalNote"
            :label="t('student.views.studentToolsTracesView.studentDetailedTraceModal.studentTraceDetails.personalNoteLabel')"
            disabled
          />
        </div>
      </div>

      <div class="student-detailed-trace-information__row">
        <div class="student-detailed-trace-information__left-column">
          <div class="student-detailed-trace-information__indicators">
            <AvIconText
              typography-class="b2-light"
              icon-color="var(--text2)"
              :icon="MDI_ICONS.PEOPLE_GROUP_OUTLINE"
              :text="t('student.views.studentToolsTracesView.studentDetailedTraceModal.studentTraceDetails.groupProduction')"
            />
            <AvIconText
              typography-class="b2-light"
              icon-color="var(--text2)"
              :icon="MDI_ICONS.CHECK"
              :text="t('student.views.studentToolsTracesView.studentDetailedTraceModal.studentTraceDetails.authenticProduction')"
            />
          </div>
        </div>

        <div class="student-detailed-trace-information__right-column">
          <div class="student-detailed-trace-information__ia">
            <AvToggle
              :model-value="!!trace.aiUseJustification"
              :description="t('student.views.studentToolsTracesView.studentDetailedTraceModal.studentTraceDetails.iaToggleLabel')"
              disabled
            />
            <TraceIaJustificationTextarea
              v-if="trace.aiUseJustification"
              :model-value="trace.aiUseJustification"
              :maxlength="500"
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

.student-detailed-trace-information__upload-date {
  text-align: right;
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
