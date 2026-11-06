<script setup lang="ts">
import type { ActivityContentDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { ICONS } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { isAssessmentEnabled } from '@/common/activities/rules/activities.rules'
import { EnabledDisabledStatusBadge } from '@/common/components'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import {
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY,
  ACTIVITY_TRACE_SETTING_DISABLED_VALUE,
  ACTIVITY_TRACE_SETTING_INFINITY_VALUE
} from '@/features/staff/activities/config'

interface NationalActivitySettingDetailsProps {
  activity: ActivityContentDTO
}

const { activity } = defineProps<NationalActivitySettingDetailsProps>()

const { t } = useI18n()

const isTraceEnabled = computed(() => activity.traceAllowedAssociations !== ACTIVITY_TRACE_SETTING_DISABLED_VALUE)
const isFeedbackEnabled = computed(() => activity.feedbackAllowedIterations !== ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED)
const hasAssessment = computed(() => isAssessmentEnabled(activity))
const hasAssessmentGrade = computed(() => typeof activity.assessment?.grade === 'number')

const feedbackIterationsLabel = computed(() => activity.feedbackAllowedIterations === ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY
  ? t('staff.activities.views.NationalActivityCatalogView.NationalActivitySettingDetails.badges.unlimitedIterations')
  : t(
      'staff.activities.views.NationalActivityCatalogView.NationalActivitySettingDetails.badges.feedbackIterations',
      activity.feedbackAllowedIterations
    )
)

const traceAssociationsLabel = computed(() =>
  activity.traceAllowedAssociations === ACTIVITY_TRACE_SETTING_INFINITY_VALUE
    ? t('staff.activities.views.NationalActivityCatalogView.NationalActivitySettingDetails.badges.unlimitedTraces')
    : t(
        'staff.activities.views.NationalActivityCatalogView.NationalActivitySettingDetails.badges.traceAssociations',
        activity.traceAllowedAssociations
      )
)

const assessmentGradeLabel = computed(() => t(
  'staff.activities.views.NationalActivityCatalogView.NationalActivitySettingDetails.badges.assessmentGrade',
  { maxGrade: activity.assessment?.grade }
))
</script>

<template>
  <IconTitleCardContainer
    :title="t('global.activities.contentSectionTypes.MODALITIES')"
    :title-icon="MDI_ICONS.SETTINGS"
    data-testid="national-activity-setting-details"
  >
    <IconTitleCardContainer
      :title="t('staff.activities.views.EditNationalActivityView.ActivityReflectionFormField.title')"
      :title-icon="MDI_ICONS.TEXT_BOX_EDIT_OUTLINE"
      background-color="var(--other-background-base)"
      data-testid="national-activity-setting-details-reflection"
    >
      <EnabledDisabledStatusBadge :enabled="activity.enableReflection" />
    </IconTitleCardContainer>
    <IconTitleCardContainer
      :title="t('staff.activities.views.EditNationalActivityView.ActivityTraceFormField.title')"
      :title-icon="MDI_ICONS.ATTACH_FILE"
      background-color="var(--other-background-base)"
      data-testid="national-activity-setting-details-trace"
    >
      <div class="av-row av-gap-xs av-align-center av-wrap">
        <EnabledDisabledStatusBadge :enabled="isTraceEnabled" />

        <AvBadge
          v-if="isTraceEnabled"
          :label="traceAssociationsLabel"
          :icon="MDI_ICONS.ATTACH_FILE"
          color="var(--light-foreground-neutral)"
          background-color="var(--light-background-neutral)"
          data-testid="trace-associations-limit-badge"
        />
      </div>
    </IconTitleCardContainer>
    <IconTitleCardContainer
      :title="t('staff.activities.views.EditNationalActivityView.ActivityFeedbackFormField.title')"
      :title-icon="ICONS.FEEDBACK"
      background-color="var(--other-background-base)"
      data-testid="national-activity-setting-details-feedback"
    >
      <div class="av-row av-gap-xs av-align-center av-wrap">
        <EnabledDisabledStatusBadge :enabled="isFeedbackEnabled" />
        <AvBadge
          v-if="isFeedbackEnabled"
          :label="feedbackIterationsLabel"
          :icon="MDI_ICONS.CHAT_BUBBLE_OUTLINE"
          color="var(--light-foreground-neutral)"
          background-color="var(--light-background-neutral)"
        />
      </div>
    </IconTitleCardContainer>
    <IconTitleCardContainer
      :title="t('staff.activities.views.EditNationalActivityView.ActivityAssessmentFormFieldsContainer.title')"
      :title-icon="MDI_ICONS.TEXT_BOX_CHECK_OUTLINE"
      background-color="var(--other-background-base)"
      data-testid="national-activity-setting-details-assessment"
    >
      <div class="av-row av-gap-xs av-align-center av-wrap">
        <EnabledDisabledStatusBadge :enabled="hasAssessment" />

        <AvBadge
          v-if="activity.assessment?.comment"
          :label="t('staff.activities.views.NationalActivityCatalogView.NationalActivitySettingDetails.badges.assessmentComment')"
          :icon="MDI_ICONS.POST_IT_NOTES_OUTLINE"
          color="var(--light-foreground-neutral)"
          background-color="var(--light-background-neutral)"
          data-testid="assessment-comment-badge"
        />
        <AvBadge
          v-if="hasAssessmentGrade"
          :label="assessmentGradeLabel"
          :icon="MDI_ICONS.CHART_TIMELINE_VARIANT_SHIMMER"
          color="var(--light-foreground-neutral)"
          background-color="var(--light-background-neutral)"
          data-testid="assessment-grade-badge"
        />
        <AvBadge
          v-if="activity.assessment?.validation"
          :label="t('staff.activities.views.NationalActivityCatalogView.NationalActivitySettingDetails.badges.assessmentValidation')"
          :icon="MDI_ICONS.CHECK_CIRCLE_OUTLINE"
          color="var(--light-foreground-neutral)"
          background-color="var(--light-background-neutral)"
          data-testid="assessment-validation-badge"
        />
      </div>
    </IconTitleCardContainer>
  </IconTitleCardContainer>
</template>
