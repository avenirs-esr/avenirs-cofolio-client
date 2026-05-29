<script setup lang="ts">
import type { ActivityContentDTO } from '@/api/avenir-esr'
import { EnabledDisabledStatusBadge } from '@/common/components'
import { ICONS } from '@/common/constants'
import {
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY,
  ACTIVITY_TRACE_SETTING_DISABLED_VALUE
} from '@/features/staff/activities/config'
import FormFieldCardContainer from '@/features/staff/global/components/cards/FormFieldCardContainer/FormFieldCardContainer.vue'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface NationalActivitySettingDetailsProps {
  activity: ActivityContentDTO
}

const { activity } = defineProps<NationalActivitySettingDetailsProps>()

const { t } = useI18n()

const isTraceEnabled = computed(() => activity.traceAllowedAssociations !== ACTIVITY_TRACE_SETTING_DISABLED_VALUE)
const isFeedbackEnabled = computed(() => activity.feedbackAllowedIterations !== ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED)

const feedbackIterationsLabel = computed(() => activity.feedbackAllowedIterations === ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY
  ? t('staff.activities.views.NationalActivityCatalogView.NationalActivitySettingDetails.badges.unlimitedIterations')
  : t(
      'staff.activities.views.NationalActivityCatalogView.NationalActivitySettingDetails.badges.feedbackIterations',
      activity.feedbackAllowedIterations
    )
)
</script>

<template>
  <FormFieldCardContainer
    :title="t('staff.activities.views.AddNationalActivityView.sideNavigation.content.MODALITIES')"
    :title-icon="MDI_ICONS.SETTINGS"
    data-testid="national-activity-setting-details"
  >
    <FormFieldCardContainer
      :title="t('staff.activities.views.EditNationalActivityView.ActivityReflectionFormField.title')"
      :title-icon="MDI_ICONS.TEXT_BOX_EDIT_OUTLINE"
      background-color="var(--other-background-base)"
      data-testid="national-activity-setting-details-reflection"
    >
      <EnabledDisabledStatusBadge :enabled="activity.enableReflection" />
    </FormFieldCardContainer>
    <FormFieldCardContainer
      :title="t('staff.activities.views.EditNationalActivityView.ActivityTraceFormField.title')"
      :title-icon="MDI_ICONS.ATTACH_FILE"
      background-color="var(--other-background-base)"
      data-testid="national-activity-setting-details-trace"
    >
      <EnabledDisabledStatusBadge :enabled="isTraceEnabled" />
    </FormFieldCardContainer>
    <FormFieldCardContainer
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
    </FormFieldCardContainer>
  </FormFieldCardContainer>
</template>
