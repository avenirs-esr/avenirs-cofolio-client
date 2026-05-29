<script setup lang="ts">
import type { ActivityContentDTO } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import ActivityConsignFormField from '@/features/staff/activities/components/interactions/formFields/ActivityConsignFormField/ActivityConsignFormField.vue'
import ActivityExecutionPeriodFormField
  from '@/features/staff/activities/components/interactions/formFields/ActivityExecutionPeriodFormField/ActivityExecutionPeriodFormField.vue'
import ActivityFeedbackFormField from '@/features/staff/activities/components/interactions/formFields/ActivityFeedbackFormField/ActivityFeedbackFormField.vue'
import ActivityReflectionFormField from '@/features/staff/activities/components/interactions/formFields/ActivityReflectionFormField/ActivityReflectionFormField.vue'
import ActivityTitleFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
import ActivityTraceFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTraceFormField/ActivityTraceFormField.vue'
import { ContentSectionId } from '@/features/staff/activities/editActivity.constants'
import ThematicSelectFormField from '@/features/staff/activities/views/ActivitiesView/components/tabs/NationalActivityContentTab/interactions/formFields/ThematicSelectFormField/ThematicSelectFormField.vue'
import EditNationalActivityViewTabActions from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.vue'
import { useEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import FormFieldCardContainer from '@/features/staff/global/components/cards/FormFieldCardContainer/FormFieldCardContainer.vue'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface ActivityContentTabProps {
  activity: ActivityContentDTO
}

defineProps<ActivityContentTabProps>()

const emit = defineEmits<{
  (e: 'nextStep'): void
}>()

const { form, save, isUpdating } = useEditNationalActivityViewContext()
const { t } = useI18n()

const isFormDirty = form.useStore(state => state.isDirty)
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="activity-content-tab"
  >
    <div :id="ContentSectionId.TITLE">
      <FormFieldCardContainer
        :title="`${t('staff.activities.interactions.inputs.ActivityTitleInput.label')} *`"
        :title-icon="ICONS.ACTIVITY"
      >
        <ActivityTitleFormField
          :form="form"
          @autosave="save"
        />
      </FormFieldCardContainer>
    </div>

    <div :id="ContentSectionId.THEMATIC">
      <FormFieldCardContainer
        :title="`${t('staff.activities.interactions.inputs.ThematicSelect.label')} *`"
        :title-icon="MDI_ICONS.BOOK_OPEN_VARIANT"
      >
        <ThematicSelectFormField
          :form="form"
          @autosave="save"
        />
      </FormFieldCardContainer>
    </div>

    <div :id="ContentSectionId.INSTRUCTIONS">
      <FormFieldCardContainer
        :title="t('staff.activities.views.AddNationalActivityView.sideNavigation.content.INSTRUCTIONS')"
        :title-icon="MDI_ICONS.TEXT_BOX_EDIT_OUTLINE"
        collapsible
        collapsed
      >
        <ActivityConsignFormField
          :form="form"
          @autosave="save"
        />
      </FormFieldCardContainer>
    </div>
    <div :id="ContentSectionId.CONTEXT">
      <FormFieldCardContainer
        :title="t('staff.activities.interactions.formFields.ActivityExecutionPeriodFormField.label')"
        :title-icon="MDI_ICONS.TEXT_BOX_EDIT_OUTLINE"
        collapsible
        collapsed
      >
        <ActivityExecutionPeriodFormField
          :form="form"
          min-height="15rem"
          @autosave="save"
        />
      </FormFieldCardContainer>
    </div>
    <div :id="ContentSectionId.MODALITIES">
      <FormFieldCardContainer
        :title="t('staff.activities.views.AddNationalActivityView.sideNavigation.content.MODALITIES')"
        :title-icon="MDI_ICONS.SETTINGS"
        collapsible
      >
        <ActivityReflectionFormField
          :form="form"
          @autosave="save"
        />
        <ActivityTraceFormField
          :form="form"
          @autosave="save"
        />
        <ActivityFeedbackFormField
          :form="form"
          @autosave="save"
        />
      </FormFieldCardContainer>
    </div>
    <div class="av-row av-gap-sm av-justify-end">
      <EditNationalActivityViewTabActions />
      <AvButton
        data-testid="activity-content-tab-next-step-button"
        variant="FLAT"
        :icon="MDI_ICONS.ARROW_RIGHT"
        :label="t('staff.activities.views.EditNationalActivityView.ActivityContentTab.nextStepLabel')"
        small
        :is-loading="isFormDirty || isUpdating"
        @click="emit('nextStep')"
      />
    </div>
  </div>
</template>
