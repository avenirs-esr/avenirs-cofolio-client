<script lang="ts" setup>
import type { AvBadgeProps } from '@avenirs-esr/avenirs-dsav'
import type { DeclaredActivityAssessmentDetailsDTO } from '@/api/avenir-esr'
import { AvBadge, AvButton, AvMessage, MDI_ICONS, MS_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import FloatingPanel from '@/common/components/overlay/FloatingPanel/FloatingPanel.vue'
import { useDateUtils } from '@/common/composables'
import { ICONS } from '@/common/constants'
import AssessmentCommentFormField
  from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/interaction/formFields/AssessmentCommentFormField/AssessmentCommentFormField.vue'
import AssessmentGradeFormField
  from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/interaction/formFields/AssessmentGradeFormField/AssessmentGradeFormField.vue'
import AssessmentValidationFormField
  from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/interaction/formFields/AssessmentValidationFormField/AssessmentValidationFormField.vue'
import { useWriteAssessmentForm } from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/composables/use-write-assessment-form/use-write-assessment-form'

export interface AssessmentManagementFloatingPanelProps {
  assessment: DeclaredActivityAssessmentDetailsDTO
  activityTitle: string
}

const { assessment, activityTitle } = defineProps<AssessmentManagementFloatingPanelProps>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()
const { formatTranslatedDateTime } = useDateUtils()

const floatingPanel = ref<InstanceType<typeof FloatingPanel>>()

const {
  form,
  maxGrade,
  isValidationEnabled,
  isCommentEnabled,
  isCommentRequired,
  isSent,
  isEditing,
  isReadonly,
  sentAssessment,
  isComplete,
  isDraftSaved,
  isSending,
  startEditing,
  cancelEditing
} = useWriteAssessmentForm({
  assessment: computed(() => assessment),
  onAssessmentSent: () => floatingPanel.value?.togglePanel()
})

const sentAtMessage = computed(() => sentAssessment.value?.assessedAt
  ? t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.sentAt', { date: formatTranslatedDateTime(sentAssessment.value.assessedAt) })
  : undefined
)

const avBadgeProps = computed<AvBadgeProps>(() => ({
  label: isDraftSaved.value
    ? t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.draft.saved')
    : t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.draft.notSaved'),
  icon: isDraftSaved.value ? MDI_ICONS.CONTENT_SAVE_OUTLINE : MDI_ICONS.ALERT_CIRCLE_OUTLINE,
  color: isDraftSaved.value ? 'var(--other-background-base)' : 'var(--light-foreground-error)',
  backgroundColor: isDraftSaved.value ? 'var(--dark-background-primary1)' : 'var(--light-background-error)',
}))

const sendDisabledTooltip = computed(() => isComplete.value
  ? undefined
  : t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.incompleteTooltip')
)

const cancelDisabledTooltip = computed(() => isEditing.value
  ? undefined
  : t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.noUpdateInProgressTooltip')
)
</script>

<template>
  <FloatingPanel
    ref="floatingPanel"
    :title="t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.title')"
    :subtitle="!isMobile ? activityTitle : undefined"
    :icon="ICONS.ASSESSMENT"
    class="assessment-floating-panel"
    data-testid="assessment-floating-panel"
  >
    <div class="av-col av-gap-md av-px-xs">
      <span
        v-if="isMobile"
        class="b2-bold title--mobile av-pb-sm av-separator-bottom"
      >{{ activityTitle }}</span>

      <AvMessage
        v-if="sentAtMessage"
        type="info"
        :message="sentAtMessage"
        data-testid="assessment-sent-message"
      />
      <div
        v-else-if="isDraftSaved !== undefined"
        class="av-row av-justify-end"
      >
        <AvBadge
          v-bind="avBadgeProps"
          data-testid="assessment-draft-badge"
        />
      </div>

      <!-- Submitting only through the send button: an implicit submission (Enter key) would send the assessment to the learner -->
      <form
        class="av-col av-gap-lg"
        data-testid="write-assessment-form"
        @submit.prevent
      >
        <AssessmentGradeFormField
          v-if="maxGrade !== undefined"
          :form="form"
          :max-grade="maxGrade"
          :readonly="isReadonly"
        />
        <AssessmentValidationFormField
          v-if="isValidationEnabled"
          :form="form"
          :readonly="isReadonly"
        />
        <AssessmentCommentFormField
          v-if="isCommentEnabled"
          :form="form"
          :required="isCommentRequired"
          :readonly="isReadonly"
        />
      </form>

      <div class="av-row av-justify-end av-gap-sm av-p-md">
        <AvButton
          v-if="isSent"
          :label="t('global.buttons.cancel')"
          :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
          variant="OUTLINED"
          :is-loading="isSending"
          :disabled="!isEditing"
          :disabled-tooltip="cancelDisabledTooltip"
          data-testid="cancel-assessment-update-button"
          @click="cancelEditing"
        />
        <AvButton
          v-if="isReadonly"
          :label="t('global.buttons.update')"
          :icon="MDI_ICONS.PENCIL_OUTLINE"
          data-testid="update-assessment-button"
          @click="startEditing"
        />
        <AvButton
          v-else
          :label="t('global.buttons.send')"
          :icon="MS_ICONS.SEND_OUTLINE_ROUNDED"
          :is-loading="isSending"
          :disabled="!isComplete"
          :disabled-tooltip="sendDisabledTooltip"
          data-testid="send-assessment-button"
          @click="form.handleSubmit"
        />
      </div>
    </div>
  </FloatingPanel>
</template>

<style scoped lang="scss">
@use '@avenirs-esr/avenirs-dsav/mixins' as dsav;

.assessment-floating-panel > :deep(.av-card[data-collapsed='false'] > .av-card__content-collapsible) {
  overscroll-behavior-y: contain;
  overflow-y: auto;

  @include dsav.min-width(md) {
    max-height: 70vh;
  }
}

:deep() {
  .av-card__title {
    background-color: var(--light-background-primary2) !important;
  }
}
</style>
