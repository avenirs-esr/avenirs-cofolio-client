<script setup lang="ts">
import type { ActivityPresentationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { AvButton, AvMessage, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { ConfirmationModal, ICONS, useApiErrors, useModal, useTaskLoading } from '@avenirs-esr/shared'
import { invalidateGetStaffActivityLibrary, invalidateGetStaffActivityWorkingSpace, usePublishActivityDraft } from '@avenirs-esr/shared/api/avenir-esr'
import { useQueryClient } from '@tanstack/vue-query'
import isEmpty from 'lodash-es/isEmpty'
import { useI18n } from 'vue-i18n'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import ActivityBannerFormField from '@/features/staff/activities/components/interactions/formFields/ActivityBannerFormField/ActivityBannerFormField.vue'
import ActivityRecommendedCompletionContextsFormField from '@/features/staff/activities/components/interactions/formFields/ActivityRecommendedCompletionContextsFormField/ActivityRecommendedCompletionContextsFormField.vue'
import ActivitySummaryFormField from '@/features/staff/activities/components/interactions/formFields/ActivitySummaryFormField/ActivitySummaryFormField.vue'
import ActivityTargetsFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTargetsFormField/ActivityTargetsFormField.vue'
import ActivityTitleFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
import { PublicationSectionId } from '@/features/staff/activities/editActivity.constants'
import EditNationalActivityViewTabActions from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.vue'
import { useEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { useToasterStore } from '@/store'

interface ActivityPublicationTabProps {
  activity: ActivityPresentationDTO
  persistedTargetIds?: string[]
  lockPersistedTargets?: boolean
  hasPublishRight?: boolean
}

const { activity, persistedTargetIds = [], lockPersistedTargets = false, hasPublishRight = false } = defineProps<ActivityPublicationTabProps>()

const emit = defineEmits<{
  (e: 'published'): void
}>()

const PUBLISH_REQUIRED_FIELDS: Array<keyof EditActivityFormData> = ['title', 'thematic', 'description', 'recommendedCompletionContexts', 'summary']

const bannerFile = defineModel<File | null>()

const { t } = useI18n()
const { form, isUpdating, queueAutoSave } = useEditNationalActivityViewContext()
const { modalOpened, openModal, closeModal } = useModal()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const { isLoading, withTaskLoading } = useTaskLoading()
const queryClient = useQueryClient()

const { mutate: mutatePublishActivityDraft, isPending } = usePublishActivityDraft()

const isFormDirty = form.useStore(state => state.isDirty)
const isFormValid = form.useStore(state => state.isValid)
const values = form.useStore(state => state.values)

const canPublish = computed(() => {
  const hasTargets = values.value.isNational
    || !isEmpty(values.value.targetInstitutionIds)
    || !isEmpty(values.value.targetGroupIds)

  return isFormValid.value && hasTargets && PUBLISH_REQUIRED_FIELDS.every(field => !isEmpty(values.value[field]))
})

const publishBlockedMessage = computed(() => t(values.value.isNational
  ? 'staff.activities.views.EditNationalActivityView.ActivityPublicationTab.publishRequiredFieldsError'
  : 'staff.activities.views.EditNationalActivityView.ActivityPublicationTab.publishRequiredFieldsWithTargetsError'))

const publishDisabledTooltip = computed(() => hasPublishRight
  ? publishBlockedMessage.value
  : t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.publishRightOnlyTooltip'))

async function publishActivityDraft () {
  mutatePublishActivityDraft({ activityDraftId: activity.id }, {
    onSuccess: async () => {
      await withTaskLoading(() => Promise.all([
        invalidateGetStaffActivityWorkingSpace(queryClient),
        invalidateGetStaffActivityLibrary(queryClient),
      ]))
      addSuccessMessage(t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.publishSuccess'))
      closeModal()
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
        :title="t('staff.activities.interactions.inputs.ActivityTitleInput.label.activity')"
        :title-icon="ICONS.ACTIVITY"
        required
      >
        <ActivityTitleFormField
          :form="form"
          @autosave="queueAutoSave"
        />
      </IconTitleCardContainer>
    </div>

    <div :id="PublicationSectionId.TARGETS">
      <IconTitleCardContainer
        :title="t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.title')"
        :title-icon="MDI_ICONS.MAP_MARKER_RADIUS_OUTLINE"
      >
        <ActivityTargetsFormField
          :form="form"
          :persisted-ids="persistedTargetIds"
          :lock-persisted="lockPersistedTargets"
          @autosave="queueAutoSave"
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
          @autosave="queueAutoSave"
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
            @autosave="queueAutoSave"
          />
        </IconTitleCardContainer>
      </div>
      <div class="av-flex-fill--md">
        <IconTitleCardContainer
          :title="t('staff.activities.interactions.formFields.ActivityRecommendedCompletionContextsFormField.label')"
          :title-icon="MDI_ICONS.TEXT_BOX_EDIT_OUTLINE"
          required
        >
          <ActivityRecommendedCompletionContextsFormField
            :form="form"
            @autosave="queueAutoSave"
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
          :disabled="!hasPublishRight || !canPublish"
          :disabled-tooltip="publishDisabledTooltip"
          @click="openModal"
        />
      </div>
      <div
        v-if="hasPublishRight && !canPublish"
        class="av-row av-justify-end"
      >
        <AvMessage
          :message="publishBlockedMessage"
          type="warning"
        />
      </div>
    </div>
  </div>

  <ConfirmationModal
    data-testid="publish-confirmation-modal"
    :opened="modalOpened"
    :title="t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.confirmTitle')"
    :description="t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.confirmDescription')"
    :is-loading="isUpdating || isPending || isLoading"
    @confirm="publishActivityDraft"
    @close="closeModal"
  />
</template>

<style lang="scss" scoped>
:deep(textarea) {
  resize: none !important;
}
</style>
