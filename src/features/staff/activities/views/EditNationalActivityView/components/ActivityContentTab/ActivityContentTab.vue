<script setup lang="ts">
import type { ActivityContentDTO } from '@/api/avenir-esr'
import type { AddActivityResourceFormData } from '@/features/staff/activities/types/forms.types'
import { useModal } from '@/common/composables/use-modal/use-modal'
import { ICONS } from '@/common/constants'
import ActivityConsignFormField from '@/features/staff/activities/components/interactions/formFields/ActivityConsignFormField/ActivityConsignFormField.vue'
import ActivityExecutionPeriodFormField
  from '@/features/staff/activities/components/interactions/formFields/ActivityExecutionPeriodFormField/ActivityExecutionPeriodFormField.vue'
import ActivityFeedbackFormField from '@/features/staff/activities/components/interactions/formFields/ActivityFeedbackFormField/ActivityFeedbackFormField.vue'
import ActivityReflectionFormField from '@/features/staff/activities/components/interactions/formFields/ActivityReflectionFormField/ActivityReflectionFormField.vue'
import ActivityTitleFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
import ActivityTraceFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTraceFormField/ActivityTraceFormField.vue'
import ActivityResourcesList from '@/features/staff/activities/components/lists/ActivityResourcesList/ActivityResourcesList.vue'
import { ContentSectionId } from '@/features/staff/activities/editActivity.constants'
import ThematicSelectFormField from '@/features/staff/activities/views/ActivitiesView/components/tabs/NationalActivityContentTab/interactions/formFields/ThematicSelectFormField/ThematicSelectFormField.vue'
import AddActivityResourceModal from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/AddActivityResourceModal.vue'
import { isActivityResourceFileType, isActivityResourceLinkType } from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/utils/resource-form.types-guard'
import EditNationalActivityViewTabActions from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.vue'
import { useEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import IconTitleCardContainer from '@/features/staff/global/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface ActivityContentTabProps {
  activity: ActivityContentDTO
}

const { activity } = defineProps<ActivityContentTabProps>()

const emit = defineEmits<{
  (e: 'nextStep'): void
}>()

const { form, save, isUpdating } = useEditNationalActivityViewContext()
const { t } = useI18n()
const {
  showModal: showAddResourceModal,
  displayModal: displayAddResourceModal,
  hideModal: hideAddResourceModal
} = useModal()

function onResourceAdded (payload: AddActivityResourceFormData) {
  if (isActivityResourceFileType(payload) && payload.file) {
    form.setFieldValue('files', [...form.getFieldValue('files'), payload.file])
  }
  else if (isActivityResourceLinkType(payload)) {
    form.setFieldValue('links', [...form.getFieldValue('links'), payload.link])
  }
  hideAddResourceModal()
}

const isFormDirty = form.useStore(state => state.isDirty)
const hasEnrolledStudent = computed(() => activity.hasEnrolledStudent)
const files = form.useStore(state => state.values.files)
const links = form.useStore(state => state.values.links)
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="activity-content-tab"
  >
    <div :id="ContentSectionId.TITLE">
      <IconTitleCardContainer
        :title="`${t('staff.activities.interactions.inputs.ActivityTitleInput.label')} *`"
        :title-icon="ICONS.ACTIVITY"
      >
        <ActivityTitleFormField
          :form="form"
          @autosave="save"
        />
      </IconTitleCardContainer>
    </div>

    <div :id="ContentSectionId.THEMATIC">
      <IconTitleCardContainer
        :title="`${t('staff.activities.interactions.ThematicSelect.label')} *`"
        :title-icon="MDI_ICONS.BOOK_OPEN_VARIANT"
      >
        <ThematicSelectFormField
          :form="form"
          @autosave="save"
        />
      </IconTitleCardContainer>
    </div>

    <div :id="ContentSectionId.INSTRUCTIONS">
      <IconTitleCardContainer
        :title="t('global.activities.contentSectionTypes.INSTRUCTIONS')"
        :title-icon="MDI_ICONS.TEXT_BOX_EDIT_OUTLINE"
        collapsible
        collapsed
      >
        <ActivityConsignFormField
          :form="form"
          @autosave="save"
        />
      </IconTitleCardContainer>
    </div>
    <div :id="ContentSectionId.CONTEXT">
      <IconTitleCardContainer
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
      </IconTitleCardContainer>
    </div>
    <div :id="ContentSectionId.DOCUMENTS">
      <IconTitleCardContainer
        :title="t('global.activities.contentSectionTypes.DOCUMENTS')"
        :title-icon="MDI_ICONS.FILE_DOCUMENT_MULTIPLE_OUTLINE"
        collapsible
        collapsed
      >
        <ActivityResourcesList
          :files="files"
          :links="links"
          show-add-card
          @add="displayAddResourceModal()"
        />
      </IconTitleCardContainer>
    </div>
    <div :id="ContentSectionId.MODALITIES">
      <IconTitleCardContainer
        :title="t('global.activities.contentSectionTypes.MODALITIES')"
        :title-icon="MDI_ICONS.SETTINGS"
        collapsible
      >
        <ActivityReflectionFormField
          :disabled="hasEnrolledStudent"
          :form="form"
          @autosave="save"
        />
        <ActivityTraceFormField
          :disabled="hasEnrolledStudent"
          :form="form"
          @autosave="save"
        />
        <ActivityFeedbackFormField
          :disabled="hasEnrolledStudent"
          :form="form"
          @autosave="save"
        />
      </IconTitleCardContainer>
    </div>
    <AddActivityResourceModal
      :opened="showAddResourceModal"
      @close="hideAddResourceModal"
      @added="onResourceAdded"
    />
    <div class="av-row av-wrap av-gap-sm av-justify-end">
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
