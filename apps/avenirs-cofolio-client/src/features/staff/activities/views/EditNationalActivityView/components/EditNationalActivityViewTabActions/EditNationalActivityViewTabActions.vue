<script setup lang="ts">
import type { ActivityPresentationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { AvButton, AvMessage, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { ConfirmationModal, useApiErrors, useModal, useTaskLoading } from '@avenirs-esr/shared'
import {
  invalidateGetStaffActivityLibrary,
  invalidateGetStaffActivityWorkingSpace,
  usePublishActivityDraft
} from '@avenirs-esr/shared/api/avenir-esr'
import { useQueryClient } from '@tanstack/vue-query'
import isEmpty from 'lodash-es/isEmpty'
import { useI18n } from 'vue-i18n'
import { ROUTES } from '@/common/constants'
import { useEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { useToasterStore } from '@/store'

interface EditNationalActivityViewTabActionsProps {
  activity: ActivityPresentationDTO
  nextStepConfig?: boolean
  hasPublishRight?: boolean
}

const { activity, nextStepConfig = false, hasPublishRight = false } = defineProps<EditNationalActivityViewTabActionsProps>()

const emit = defineEmits<{
  (e: 'nextStep'): void
  (e: 'published'): void
}>()

const { t } = useI18n()
const { modalOpened, openModal, closeModal } = useModal()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const { isLoading, withTaskLoading } = useTaskLoading()
const queryClient = useQueryClient()
const { mutate: mutatePublishActivityDraft, isPending } = usePublishActivityDraft()
const {
  form,
  isSaving,
  isBusy,
  canSave,
  saveNow,
} = useEditNationalActivityViewContext()

const parentId = computed(() => activity.mainActivityId)
const isSubActivity = computed(() => !!parentId.value)
const isFormValid = form.useStore(state => state.isValid)
const values = form.useStore(state => state.values)

const PUBLISH_REQUIRED_FIELDS: Array<keyof EditActivityFormData> = ['title', 'thematic', 'description', 'recommendedCompletionContexts', 'summary']
const PUBLISH_REQUIRED_FIELDS_SUB_ACTIVITY: Array<keyof EditActivityFormData> = ['title', 'description', 'recommendedCompletionContexts']

const isFormPublishable = computed(() => {
  if (isSubActivity.value) {
    return isFormValid.value && PUBLISH_REQUIRED_FIELDS_SUB_ACTIVITY.every(field => !isEmpty(values.value[field]))
  }
  else {
    const hasTargets = values.value.isNational
      || !isEmpty(values.value.targetInstitutionIds)
      || !isEmpty(values.value.targetGroupIds)

    return isFormValid.value && hasTargets && PUBLISH_REQUIRED_FIELDS.every(field => !isEmpty(values.value[field]))
  }
})
const hasUnpublishableSubActivities = computed(() => activity.subActivities.some(({ publishable }) => !publishable))
const canPublish = computed(() => isFormPublishable.value && !hasUnpublishableSubActivities.value)

const publishBlockedMessage = computed(() => {
  if (!isFormPublishable.value) {
    if (isSubActivity.value) {
      return t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.publishRequiredFieldsSubActivityError')
    }
    else {
      return t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.publishRequiredFieldsError')
    }
  }
  if (hasUnpublishableSubActivities.value) {
    return t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.publishUnpublishableSubActivitiesError')
  }

  return undefined
})

const publishDisabledTooltip = computed(() => hasPublishRight
  ? publishBlockedMessage.value
  : t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.publishRightOnlyTooltip'))

async function publishActivityDraft () {
  mutatePublishActivityDraft({ activityDraftId: activity.id }, {
    onSuccess: async () => {
      await withTaskLoading(() => Promise.all([
        invalidateGetStaffActivityWorkingSpace(queryClient),
        invalidateGetStaffActivityLibrary(queryClient),
      ]))
      addSuccessMessage(t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.publishSuccess'))
      closeModal()
      setTimeout(() => emit('published'), 10)
    },
    onError: (error) => {
      addErrorMessage({
        title: t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.publishError'),
        description: getErrorMessage(error),
      })
    }
  })
}
</script>

<template>
  <div class="av-col av-gap-xs">
    <div class="av-row av-gap-sm av-justify-end">
      <AvButton
        data-testid="exit-button"
        :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
        :label="t('global.buttons.exit')"
        :is-loading="isBusy"
        :to="ROUTES.STAFF.ACTIVITIES"
      />
      <AvButton
        v-if="!isSubActivity"
        data-testid="save-button"
        :icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
        :label="t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.saveLabel')"
        :disabled="!canSave"
        :disabled-tooltip="t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.saveDisabledTooltip')"
        :is-loading="isSaving"
        @click="saveNow"
      />
      <div v-if="!isSubActivity">
        <AvButton
          v-if="!nextStepConfig"
          data-testid="publish-button"
          variant="FLAT"
          :icon="RI_ICONS.SEND_PLANE_LINE"
          :label="t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.publishLabel')"
          :is-loading="isBusy || isPending || isLoading"
          :disabled="!hasPublishRight || !canPublish"
          :disabled-tooltip="publishDisabledTooltip"
          @click="openModal"
        />
        <AvButton
          v-else
          data-testid="activity-content-tab-next-step-button"
          variant="FLAT"
          :icon="MDI_ICONS.ARROW_RIGHT"
          :label="t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.nextStepLabel')"
          :is-loading="isBusy"
          @click="emit('nextStep')"
        />
      </div>
      <AvButton
        v-else
        :is-loading="isBusy"
        :icon="MDI_ICONS.ARROW_RIGHT_THIN"
        data-testid="back-to-parent-button"
        :label="t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.backToParent')"
        :to="{ name: ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY.name, params: { id: parentId! } }"
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

  <ConfirmationModal
    data-testid="publish-confirmation-modal"
    :opened="modalOpened"
    :title="t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.confirmTitle')"
    :description="t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.confirmDescription')"
    :is-loading="isBusy || isPending || isLoading"
    @confirm="publishActivityDraft"
    @close="closeModal"
  />
</template>
