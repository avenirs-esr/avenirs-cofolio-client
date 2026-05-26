<script setup lang="ts">
import { type ActivityContentDTO, invalidateGetStaffActivityLibrary, invalidateGetStaffActivityWorkingSpace, usePublishActivityDraft } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { ICONS } from '@/common/constants'
import ActivityExecutionPeriodFormField from '@/features/staff/activities/components/interactions/formFields/ActivityExecutionPeriodFormField/ActivityExecutionPeriodFormField.vue'
import ActivitySummaryFormField from '@/features/staff/activities/components/interactions/formFields/ActivitySummaryFormField/ActivitySummaryFormField.vue'
import ActivityTitleFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
import { PublicationSectionId } from '@/features/staff/activities/editActivity.constants'
import EditNationalActivityViewTabActions from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.vue'
import { useEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import FormFieldCardContainer from '@/features/staff/global/components/cards/FormFieldCardContainer/FormFieldCardContainer.vue'
import { useToasterStore } from '@/store'
import { AvButton, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

interface ActivityContentTabProps {
  activity: ActivityContentDTO
}

const { activity } = defineProps<ActivityContentTabProps>()

const emit = defineEmits<{
  (e: 'published'): void
}>()

const { t } = useI18n()

const { form, isUpdating, save } = useEditNationalActivityViewContext()
const { showModal, displayModal, hideModal } = useModal()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const { isLoading, withTaskLoading } = useTaskLoading()
const queryClient = useQueryClient()
const isFormDirty = form.useStore(state => state.isDirty)
const { hasFieldErrors } = useFormValidators()
const hasPublishFieldErrors = hasFieldErrors(form, ['title', 'summary'])

const { mutate: mutatePublishActivityDraft, isPending } = usePublishActivityDraft()

async function openPublishConfirmation () {
  await form.validate('submit')

  if (hasPublishFieldErrors.value) {
    return
  }

  displayModal()
}

async function publishActivityDraft () {
  mutatePublishActivityDraft({ activityDraftId: activity.id }, {
    onSuccess: async () => {
      await withTaskLoading(() => Promise.all([
        invalidateGetStaffActivityWorkingSpace(queryClient),
        invalidateGetStaffActivityLibrary(queryClient),
      ]))

      addSuccessMessage(t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.publishSuccess'))
      hideModal()

      setTimeout(() => {
        emit('published')
      }, 10)
    },
    onError: (error) => {
      addErrorMessage({
        title: t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.publishError'),
        description: error.message
      })
    }
  })
}
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="activity-publication-tab-content"
  >
    <div :id="PublicationSectionId.ACTIVITY_TITLE">
      <FormFieldCardContainer
        :title="t('staff.activities.views.AddNationalActivityView.sideNavigation.content.TITLE')"
        :title-icon="ICONS.ACTIVITY"
      >
        <ActivityTitleFormField
          :form="form"
          @autosave="save"
        />
      </FormFieldCardContainer>
    </div>
    <div
      :id="PublicationSectionId.SUMMARY_CONTEXT"
      class="av-row av-w-full av-gap-sm"
    >
      <div class="av-flex-fill">
        <FormFieldCardContainer
          :title="`${t('staff.activities.views.EditNationalActivityView.ActivitySummaryFormField.label')} *`"
          :title-icon="MDI_ICONS.FILE_DOCUMENT_EDIT_OUTLINE"
        >
          <ActivitySummaryFormField
            :form="form"
            @autosave="save"
          />
        </FormFieldCardContainer>
      </div>
      <div class="av-flex-fill">
        <FormFieldCardContainer
          :title="t('staff.activities.interactions.formFields.ActivityExecutionPeriodFormField.label')"
          :title-icon="MDI_ICONS.TEXT_BOX_EDIT_OUTLINE"
        >
          <ActivityExecutionPeriodFormField
            :form="form"
            @autosave="save"
          />
        </FormFieldCardContainer>
      </div>
    </div>
    <div class="av-row av-gap-sm av-justify-end">
      <EditNationalActivityViewTabActions />
      <AvButton
        data-testid="publish-button"
        variant="FLAT"
        :icon="RI_ICONS.SEND_PLANE_LINE"
        :label="t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.publishLabel')"
        :is-loading="isFormDirty || isUpdating || isPending || isLoading"
        small
        @click="openPublishConfirmation"
      />
    </div>
  </div>
  <ConfirmationModal
    :show="showModal"
    :title="t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.confirmTitle')"
    :description="t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.confirmDescription')"
    :is-loading="isUpdating || isPending || isLoading"
    @confirm="publishActivityDraft"
    @close="hideModal"
  />
</template>

<style lang="scss" scoped>
:deep(textarea) {
  resize: none !important;
}
</style>
