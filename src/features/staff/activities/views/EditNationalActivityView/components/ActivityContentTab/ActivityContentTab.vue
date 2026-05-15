<script setup lang="ts">
import type { ActivityContentDTO } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import ActivityTitleFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
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

const { form } = useEditNationalActivityViewContext()
const { t } = useI18n()
</script>

<template>
  <div class="av-col av-gap-xl">
    <FormFieldCardContainer
      :title="t('staff.activities.interactions.inputs.ActivityTitleInput.label')"
      :title-icon="ICONS.ACTIVITY"
    >
      <ActivityTitleFormField
        :form="form"
        is-textarea
      />
    </FormFieldCardContainer>
    <div class="av-row av-gap-sm av-justify-end">
      <EditNationalActivityViewTabActions />
      <AvButton
        variant="FLAT"
        :icon="MDI_ICONS.ARROW_RIGHT"
        :label="t('staff.activities.views.EditNationalActivityView.ActivityContentTab.nextStepLabel')"
        small
        @click="emit('nextStep')"
      />
    </div>
  </div>
</template>
