<script setup lang="ts">
import type { BaseApiException } from '@avenirs-esr/shared'
import type { ActivityDraftCreationResponse } from '@/api/avenir-esr'
import type { ActivityDraftCreationFormData } from '@/features/staff/activities/types/forms.types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { ConfirmationModal, useApiErrors } from '@avenirs-esr/shared'
import { useCreateActivityDraft } from '@avenirs-esr/shared/api/avenir-esr'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { EActivityStatus, invalidateGetActivityContent, invalidateGetActivityPresentation, useCreateSubActivityDraft } from '@/api/avenir-esr'
import { useNavigation } from '@/common/composables'
import ActivityTitleFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
import { useToasterStore } from '@/store'

export interface ActivityCreationModalProps {
  opened: boolean
  activityDraftId?: string
}

const {
  opened,
  activityDraftId,
} = defineProps<ActivityCreationModalProps>()

const emit = defineEmits<{
  close: []
}>()

const CREATE_ACTIVITY_FORM_DEFAULT_VALUES = { title: '' }

const { t } = useI18n()
const { navigateToStaffActivitiesEditNationalActivity } = useNavigation()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage } = useToasterStore()
const queryClient = useQueryClient()

const { mutate: mutateCreateActivityDraft, isPending: isActivityDraftPending } = useCreateActivityDraft({
  mutation: {
    onSuccess,
    onError
  }
})
const { mutate: mutateCreateSubActivityDraft, isPending: isSubActivityDraftPending } = useCreateSubActivityDraft({
  mutation: {
    onSuccess,
    onError
  }
})

const form = useForm({
  defaultValues: {
    ...CREATE_ACTIVITY_FORM_DEFAULT_VALUES,
  } satisfies ActivityDraftCreationFormData,
  onSubmit: ({ value }) => {
    const data = {
      title: value.title
    }

    if (activityDraftId) {
      mutateCreateSubActivityDraft({
        activityDraftId,
        data
      })
      return
    }

    mutateCreateActivityDraft({
      data
    })
  }
})

const isPending = computed(() => isActivityDraftPending.value || isSubActivityDraftPending.value)
const isFormValid = computed(() => form.useStore(s => s.isValid && !s.isValidating && s.isDirty).value)

function onClose () {
  form.reset({ ...CREATE_ACTIVITY_FORM_DEFAULT_VALUES })
  emit('close')
}

async function onSuccess (response: ActivityDraftCreationResponse) {
  if (activityDraftId) {
    await invalidateGetActivityContent(queryClient, EActivityStatus.DRAFT, activityDraftId)
    await invalidateGetActivityPresentation(queryClient, EActivityStatus.DRAFT, activityDraftId)
  }

  onClose()

  if (!activityDraftId) {
    navigateToStaffActivitiesEditNationalActivity({ id: response.draftId, mode: 'add' })
  }
}

function onError (error: BaseApiException) {
  addErrorMessage({
    title: t(`staff.activities.modals.ActivityCreationModal.error.${activityDraftId ? 'subActivity' : 'activity'}`),
    description: getErrorMessage(error)
  })
}
</script>

<template>
  <ConfirmationModal
    :opened
    :confirm-button-icon="MDI_ICONS.ARROW_RIGHT"
    :confirm-button-disabled="!isFormValid"
    :confirm-button-disabled-tooltip="t('global.information.invalidForm')"
    :is-loading="isPending"
    data-testid="activity-creation-modal"
    @close="onClose"
    @confirm="form.handleSubmit()"
  >
    <template #header>
      <span
        class="b2-bold av-pt-md"
        data-testid="activity-creation-modal-title"
      >
        {{ t(`staff.activities.modals.ActivityCreationModal.title.${!!activityDraftId ? 'subActivity' : 'activity'}`) }}
      </span>
    </template>

    <form
      novalidate
      @submit.prevent="form.handleSubmit()"
    >
      <ActivityTitleFormField
        :form="form"
        :is-sub-activity="!!activityDraftId"
        label-visible
        data-testid="activity-title-form-field"
      />
    </form>
  </ConfirmationModal>
</template>
