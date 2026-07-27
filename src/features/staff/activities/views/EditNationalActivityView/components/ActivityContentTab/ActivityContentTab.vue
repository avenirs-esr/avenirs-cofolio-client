<script setup lang="ts">
import type { ActivityContentDTO, FileDTO } from '@/api/avenir-esr'
import type { AddActivityResourceFormData } from '@/features/staff/activities/types/forms.types'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import { ICONS } from '@/common/constants'
import { isDifferentFile } from '@/common/utils/file/file'
import ActivityConsignFormField from '@/features/staff/activities/components/interactions/formFields/ActivityConsignFormField/ActivityConsignFormField.vue'
import ActivityFeedbackFormField from '@/features/staff/activities/components/interactions/formFields/ActivityFeedbackFormField/ActivityFeedbackFormField.vue'
import ActivityRecommendedCompletionContextsFormField
  from '@/features/staff/activities/components/interactions/formFields/ActivityRecommendedCompletionContextsFormField/ActivityRecommendedCompletionContextsFormField.vue'
import ActivityReflectionFormField from '@/features/staff/activities/components/interactions/formFields/ActivityReflectionFormField/ActivityReflectionFormField.vue'
import ActivityTitleFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
import ActivityTraceFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTraceFormField/ActivityTraceFormField.vue'
import ActivityResourcesListEditable from '@/features/staff/activities/components/lists/ActivityResourcesListEditable/ActivityResourcesListEditable.vue'
import { ContentSectionId } from '@/features/staff/activities/editActivity.constants'
import ThematicSelectFormField from '@/features/staff/activities/views/ActivitiesView/components/tabs/NationalActivityContentTab/interactions/formFields/ThematicSelectFormField/ThematicSelectFormField.vue'
import { isActivityResourceFileType, isActivityResourceLinkType } from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/utils/resource-form.types-guard'
import EditNationalActivityViewTabActions from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.vue'
import { useEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface ActivityContentTabProps {
  activity: ActivityContentDTO
}

const { activity } = defineProps<ActivityContentTabProps>()

const emit = defineEmits<{
  (e: 'nextStep'): void
}>()

const { form, queueAutoSave, isUpdating } = useEditNationalActivityViewContext()
const { t } = useI18n()

const hasEnrolledStudent = computed(() => activity.hasEnrolledStudent)
const isFormDirty = form.useStore(state => state.isDirty)
const files = form.useStore(state => state.values.files)
const links = form.useStore(state => state.values.links)

function addResource (payload: AddActivityResourceFormData) {
  let newLinks: string[] | undefined

  if (isActivityResourceFileType(payload) && payload.file) {
    form.setFieldValue('files', [...form.getFieldValue('files'), payload.file])
  }
  else if (isActivityResourceLinkType(payload)) {
    newLinks = [...form.getFieldValue('links'), payload.link]
    form.setFieldValue('links', newLinks)
  }

  queueAutoSave(newLinks ? { links: newLinks } : undefined)
}

function deleteSelectedResources (files: (FileDTO | File)[], links: string[]) {
  let newLinks: string[] | undefined

  if (files.length > 0) {
    form.setFieldValue('files', form.getFieldValue('files').filter(file => files.every(selectedFile => isDifferentFile(file, selectedFile))))
  }

  if (links.length > 0) {
    newLinks = form.getFieldValue('links').filter(link => !links.includes(link))
    form.setFieldValue('links', newLinks)
  }

  queueAutoSave(newLinks ? { links: newLinks } : undefined)
}
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
          @autosave="queueAutoSave"
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
          @autosave="queueAutoSave"
        />
      </IconTitleCardContainer>
    </div>

    <div :id="ContentSectionId.INSTRUCTIONS">
      <IconTitleCardContainer
        :title="t('global.activities.contentSectionTypes.INSTRUCTIONS')"
        :title-icon="MDI_ICONS.TEXT_BOX_EDIT_OUTLINE"
        collapsible
        collapsed
        required
      >
        <ActivityConsignFormField
          :form="form"
          @autosave="queueAutoSave"
        />
      </IconTitleCardContainer>
    </div>
    <div :id="ContentSectionId.CONTEXT">
      <IconTitleCardContainer
        :title="t('staff.activities.interactions.formFields.ActivityRecommendedCompletionContextsFormField.label')"
        :title-icon="MDI_ICONS.TEXT_BOX_EDIT_OUTLINE"
        collapsible
        collapsed
        required
      >
        <ActivityRecommendedCompletionContextsFormField
          :form="form"
          min-height="15rem"
          @autosave="queueAutoSave"
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
        <ActivityResourcesListEditable
          :activity-id="activity.id"
          :files="files"
          :links="links"
          :is-form-dirty="isFormDirty"
          :is-updating="isUpdating"
          @add="addResource"
          @delete="deleteSelectedResources"
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
          @autosave="queueAutoSave"
        />
        <ActivityTraceFormField
          :disabled="hasEnrolledStudent"
          :form="form"
          @autosave="queueAutoSave"
        />
        <ActivityFeedbackFormField
          :disabled="hasEnrolledStudent"
          :form="form"
          @autosave="queueAutoSave"
        />
      </IconTitleCardContainer>
    </div>

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
