<script setup lang="ts">
import type { ActivityPresentationDTO } from '@/api/avenir-esr'
import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { invalidateGetStaffActivityLibrary, invalidateGetStaffActivityWorkingSpace, usePublishActivityDraft } from '@/api/avenir-esr'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { ICONS } from '@/common/constants'
import ActivityBannerFormField from '@/features/staff/activities/components/interactions/formFields/ActivityBannerFormField/ActivityBannerFormField.vue'
import ActivityExecutionPeriodFormField from '@/features/staff/activities/components/interactions/formFields/ActivityExecutionPeriodFormField/ActivityExecutionPeriodFormField.vue'
import ActivitySummaryFormField from '@/features/staff/activities/components/interactions/formFields/ActivitySummaryFormField/ActivitySummaryFormField.vue'
import ActivityTitleFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
import { PublicationSectionId } from '@/features/staff/activities/editActivity.constants'
import EditNationalActivityViewTabActions from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.vue'
import { useEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { useToasterStore } from '@/store'
import { AvButton, AvMessage, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import isEmpty from 'lodash-es/isEmpty'
import { useI18n } from 'vue-i18n'

interface ActivityPublicationTabProps {
  activity: ActivityPresentationDTO
}

const { activity } = defineProps<ActivityPublicationTabProps>()

const emit = defineEmits<{
  (e: 'published'): void
}>()

const PUBLISH_REQUIRED_FIELDS: Array<keyof EditActivityFormData> = ['title', 'thematic', 'description', 'executionPeriodInfo', 'summary']

const bannerFile = defineModel<File | null>()

const { t } = useI18n()
const { form, isUpdating, queueAutosave } = useEditNationalActivityViewContext()
const { showModal, displayModal, hideModal } = useModal()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const { isLoading, withTaskLoading } = useTaskLoading()
const queryClient = useQueryClient()

const { mutate: mutatePublishActivityDraft, isPending } = usePublishActivityDraft()

const isFormDirty = form.useStore(state => state.isDirty)
const isFormValid = form.useStore(state => state.isValid)
const values = form.useStore(state => state.values)

const canPublish = computed(() => {
  return isFormValid.value && PUBLISH_REQUIRED_FIELDS.every(field => !isEmpty(values.value[field]))
})

async function publishActivityDraft () {
  mutatePublishActivityDraft({ activityDraftId: activity.id }, {
    onSuccess: async () => {
      await withTaskLoading(() => Promise.all([
        invalidateGetStaffActivityWorkingSpace(queryClient),
        invalidateGetStaffActivityLibrary(queryClient),
      ]))
      addSuccessMessage(t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.publishSuccess'))
      hideModal()
      setTimeout(() => emit('published'), 10)
    },
    onError: (error) => {
      addErrorMessage({
        title: t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.publishError'),
        description: getErrorMessage(error),
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
      <IconTitleCardContainer
        :title="t('staff.activities.interactions.inputs.ActivityTitleInput.label')"
        :title-icon="ICONS.ACTIVITY"
        required
      >
        <ActivityTitleFormField
          :form="form"
          @autosave="queueAutosave"
        />
      </IconTitleCardContainer>
    </div>

    <div :id="PublicationSectionId.IMAGE">
      <IconTitleCardContainer
        :title="t('global.information.imageUpload.title')"
        :title-icon="ICONS.ACTIVITY"
      >
        <ActivityBannerFormField
          v-model="bannerFile"
          :form="form"
          :remote-banner="activity.banner"
          @autosave="queueAutosave"
        />
      </IconTitleCardContainer>
    </div>

    <div
      :id="PublicationSectionId.SUMMARY_CONTEXT"
      class="av-col av-row--md av-w-full--md av-gap-sm"
    >
      <div class="av-flex-fill--md">
        <IconTitleCardContainer
          :title="t('staff.activities.views.EditNationalActivityView.ActivitySummaryFormField.label')"
          :title-icon="MDI_ICONS.FILE_DOCUMENT_EDIT_OUTLINE"
          required
        >
          <ActivitySummaryFormField
            :form="form"
            @autosave="queueAutosave"
          />
        </IconTitleCardContainer>
      </div>
      <div class="av-flex-fill--md">
        <IconTitleCardContainer
          :title="t('staff.activities.interactions.formFields.ActivityExecutionPeriodFormField.label')"
          :title-icon="MDI_ICONS.TEXT_BOX_EDIT_OUTLINE"
          required
        >
          <ActivityExecutionPeriodFormField
            :form="form"
            @autosave="queueAutosave"
          />
        </IconTitleCardContainer>
      </div>
    </div>
    <div class="av-col">
      <div class="av-row av-wrap av-gap-sm av-justify-end">
        <EditNationalActivityViewTabActions />
        <AvButton
          data-testid="publish-button"
          variant="FLAT"
          :icon="RI_ICONS.SEND_PLANE_LINE"
          :label="t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.publishLabel')"
          :is-loading="isFormDirty || isUpdating || isPending || isLoading"
          :disabled="!canPublish"
          small
          @click="displayModal"
        />
      </div>
      <div
        v-if="!canPublish"
        class="av-row av-justify-end"
      >
        <AvMessage
          :message="t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.publishRequiredFieldsError')"
          type="warning"
        />
      </div>
    </div>
  </div>

  <ConfirmationModal
    data-testid="publish-confirmation-modal"
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
