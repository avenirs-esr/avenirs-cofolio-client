<script setup lang="ts">
import type { ActivityContentDTO } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import ActivityConsignFormField from '@/features/staff/activities/components/interactions/formFields/ActivityConsignFormField/ActivityConsignFormField.vue'
import ActivityExecutionPeriodFormField
  from '@/features/staff/activities/components/interactions/formFields/ActivityExecutionPeriodFormField/ActivityExecutionPeriodFormField.vue'
import ActivityTitleFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
import { ContentSectionId } from '@/features/staff/activities/editActivity.constants'
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

const { form, save } = useEditNationalActivityViewContext()
const { t } = useI18n()
</script>

<template>
  <div class="av-col av-gap-xl">
    <div :id="ContentSectionId.TITLE">
      <FormFieldCardContainer
        :title="t('staff.activities.views.AddNationalActivityView.sideNavigation.content.TITLE')"
        :title-icon="ICONS.ACTIVITY"
      >
        <ActivityTitleFormField :form="form" />
      </FormFieldCardContainer>
    </div>

    <div :id="ContentSectionId.INSTRUCTIONS">
      <FormFieldCardContainer
        :title="t('staff.activities.views.AddNationalActivityView.sideNavigation.content.INSTRUCTIONS')"
        :title-icon="MDI_ICONS.TEXT_BOX_EDIT_OUTLINE"
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
      >
        <ActivityExecutionPeriodFormField
          :form="form"
          min-height="15rem"
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
        @click="emit('nextStep')"
      />
    </div>
  </div>
</template>
