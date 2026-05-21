<script setup lang="ts">
import type { ActivityContentDTO } from '@/api/avenir-esr'
import ActivitySummaryFormField from '@/features/staff/activities/components/interactions/formFields/ActivitySummaryFormField/ActivitySummaryFormField.vue'
import { PublicationSectionId } from '@/features/staff/activities/editActivity.constants'
import { useEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import FormFieldCardContainer from '@/features/staff/global/components/cards/FormFieldCardContainer/FormFieldCardContainer.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface ActivityContentTabProps {
  activity: ActivityContentDTO
}

defineProps<ActivityContentTabProps>()

const { t } = useI18n()

const { form, save } = useEditNationalActivityViewContext()
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="activity-publication-tab-content"
  >
    <div class="av-row av-w-full av-gap-sm">
      <div
        :id="PublicationSectionId.SUMMARY"
        class="av-flex-fill"
      >
        <FormFieldCardContainer
          :title="`${t('staff.activities.views.AddNationalActivityView.sideNavigation.publication.SUMMARY')} *`"
          :title-icon="MDI_ICONS.FILE_DOCUMENT_EDIT_OUTLINE"
        >
          <ActivitySummaryFormField
            :form="form"
            @autosave="save"
          />
        </FormFieldCardContainer>
      </div>
    </div>
  </div>
</template>
