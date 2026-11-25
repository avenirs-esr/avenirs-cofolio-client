<script setup lang="ts">
import type { ActivityContentDTO, FileDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { Slot } from 'vue'
import type { AddActivityResourceFormData } from '@/features/staff/activities/types/forms.types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { ICONS, useModal } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import { withRequiredMark } from '@/common/utils'
import { isDifferentFile } from '@/common/utils/file/file'
import ActivityAssessmentFormFieldsContainer from '@/features/staff/activities/components/interactions/ActivityAssessmentFormFieldsContainer/ActivityAssessmentFormFieldsContainer.vue'
import ActivityConsignFormField from '@/features/staff/activities/components/interactions/formFields/ActivityConsignFormField/ActivityConsignFormField.vue'
import ActivityExecutionPeriodFormField
  from '@/features/staff/activities/components/interactions/formFields/ActivityExecutionPeriodFormField/ActivityExecutionPeriodFormField.vue'
import ActivityFeedbackFormField from '@/features/staff/activities/components/interactions/formFields/ActivityFeedbackFormField/ActivityFeedbackFormField.vue'
import ActivityRecommendedCompletionContextsFormField
  from '@/features/staff/activities/components/interactions/formFields/ActivityRecommendedCompletionContextsFormField/ActivityRecommendedCompletionContextsFormField.vue'
import ActivityReflectionFormField from '@/features/staff/activities/components/interactions/formFields/ActivityReflectionFormField/ActivityReflectionFormField.vue'
import ActivityTitleFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
import ActivityTraceFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTraceFormField/ActivityTraceFormField.vue'
import ActivityResourcesListEditable from '@/features/staff/activities/components/lists/ActivityResourcesListEditable/ActivityResourcesListEditable.vue'
import ActivityCreationModal from '@/features/staff/activities/components/modals/ActivityCreationModal/ActivityCreationModal.vue'
import { ContentSectionId } from '@/features/staff/activities/editActivity.constants'
import ThematicSelectFormField from '@/features/staff/activities/views/ActivitiesView/components/tabs/NationalActivityContentTab/interactions/formFields/ThematicSelectFormField/ThematicSelectFormField.vue'
import { isActivityResourceFileType, isActivityResourceLinkType } from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/utils/resource-form.types-guard'
import ManageSubActivitiesDropdown from '@/features/staff/activities/views/EditNationalActivityView/components/interactions/dropdowns/ManageSubActivitiesDropdown/ManageSubActivitiesDropdown.vue'
import SubActivitiesSortableList from '@/features/staff/activities/views/EditNationalActivityView/components/lists/SubActivitiesSortableList/SubActivitiesSortableList.vue'
import DeleteSubActivitiesModal from '@/features/staff/activities/views/EditNationalActivityView/components/modals/DeleteSubActivitiesModal/DeleteSubActivitiesModal.vue'
import { useEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'

interface ActivityContentTabProps {
  activity: ActivityContentDTO
}

const { activity } = defineProps<ActivityContentTabProps>()

const slots = defineSlots<{
  default?: Slot
}>()

const {
  form,
  isSaving,
  isExecutionPeriodEnabled,
  isAssessmentEnabled,
  isAssessmentGradeEnabled,
  subActivitiesOrder: {
    orderedSubActivities,
    hasPendingChanges: hasPendingSubActivitiesOrder,
    isSaving: isSavingSubActivitiesOrder,
  },
  queueAutoSave,
} = useEditNationalActivityViewContext()
const { t } = useI18n()
const {
  modalOpened: showAddSubActivityModal,
  openModal: displayAddSubActivityModal,
  closeModal: hideAddSubActivityModal,
} = useModal()
const {
  modalOpened: showDeleteSubActivitiesModal,
  openModal: displayDeleteSubActivitiesModal,
  closeModal: hideDeleteSubActivitiesModal,
} = useModal()

const hasEnrolledStudent = computed(() => activity.hasEnrolledStudent)
const isUpdatingSubActivitiesOrder = computed(() => hasPendingSubActivitiesOrder.value || isSavingSubActivitiesOrder.value)
const isFormDirty = form.useStore(state => state.isDirty)
const files = form.useStore(state => state.values.files)
const links = form.useStore(state => state.values.links)
const startDate = form.useStore(state => state.values.startDate)
const endDate = form.useStore(state => state.values.endDate)
const isSubActivity = computed(() => !!activity.mainActivityId)

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

function deleteSelectedResources (
  files: (FileDTO | File)[],
  links: string[]
) {
  let newLinks: string[] | undefined
  let newFiles: (FileDTO | File)[] | undefined

  if (files.length > 0) {
    newFiles = form.getFieldValue('files').filter(file => files.every(selectedFile => isDifferentFile(file, selectedFile)))
    form.setFieldValue('files', newFiles)
  }

  if (links.length > 0) {
    newLinks = form.getFieldValue('links').filter(link => !links.includes(link))
    form.setFieldValue('links', newLinks)
  }

  queueAutoSave({
    ...(newFiles !== undefined && { files: newFiles }),
    ...(newLinks !== undefined && { links: newLinks })
  })
}
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="activity-content-tab"
  >
    <div :id="ContentSectionId.TITLE">
      <IconTitleCardContainer
        :title="isSubActivity
          ? withRequiredMark(t('staff.activities.interactions.inputs.ActivityTitleInput.label.subActivity'))
          : withRequiredMark(t('staff.activities.interactions.inputs.ActivityTitleInput.label.activity'))"

        :title-icon="ICONS.ACTIVITY"
      >
        <ActivityTitleFormField
          :form="form"
          @autosave="queueAutoSave"
        />
      </IconTitleCardContainer>
    </div>

    <div
      v-if="!isSubActivity"
      :id="ContentSectionId.THEMATIC"
    >
      <IconTitleCardContainer
        :title="`${t('global.activities.contentSectionTypes.THEMATIC')} *`"
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
          :is-updating="isSaving"
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
        <ActivityExecutionPeriodFormField
          :form="form"
          @autosave="queueAutoSave"
          @update-execution-period-enabled="(isEnabled: boolean) => { isExecutionPeriodEnabled = isEnabled }"
        />
        <ActivityReflectionFormField
          v-if="!isSubActivity"
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
          v-if="!isSubActivity"
          :disabled="hasEnrolledStudent"
          :form="form"
          @autosave="queueAutoSave"
        />
        <ActivityAssessmentFormFieldsContainer
          v-if="!isSubActivity"
          :disabled="hasEnrolledStudent"
          :form="form"
          @autosave="queueAutoSave"
          @update-assessment-enabled="(isEnabled: boolean) => { isAssessmentEnabled = isEnabled }"
          @update-grade-enabled="(isEnabled: boolean) => { isAssessmentGradeEnabled = isEnabled }"
        />
      </IconTitleCardContainer>
    </div>

    <div
      v-if="!isSubActivity"
      :id="ContentSectionId.SUB_ACTIVITIES"
    >
      <IconTitleCardContainer
        :title="t('global.activities.contentSectionTypes.SUB_ACTIVITIES')"
        :title-icon="ICONS.SUB_ACTIVITY"
        collapsible
      >
        <template #title>
          <ManageSubActivitiesDropdown
            :is-loading="isUpdatingSubActivitiesOrder"
            :has-sub-activities="orderedSubActivities.length > 0"
            :has-enrolled-student="hasEnrolledStudent"
            @add="displayAddSubActivityModal"
            @delete="displayDeleteSubActivitiesModal"
          />
        </template>

        <SubActivitiesSortableList
          v-model="orderedSubActivities"
          :activity-start-date="startDate"
          :activity-end-date="endDate"
          :is-loading="isSavingSubActivitiesOrder"
        />
      </IconTitleCardContainer>
    </div>

    <template
      v-if="slots.default"
    >
      <slot />
    </template>
  </div>

  <ActivityCreationModal
    :activity-draft-id="activity.id"
    :opened="showAddSubActivityModal"
    @close="hideAddSubActivityModal"
  />

  <DeleteSubActivitiesModal
    :opened="showDeleteSubActivitiesModal"
    :activity-draft-id="activity.id"
    :sub-activities="orderedSubActivities"
    @cancel="hideDeleteSubActivitiesModal"
    @deleted="hideDeleteSubActivitiesModal"
  />
</template>
