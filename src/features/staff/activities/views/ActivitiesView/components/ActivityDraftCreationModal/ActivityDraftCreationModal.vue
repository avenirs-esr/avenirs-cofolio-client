<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import type { ActivityDraftCreationFormData } from '@/features/staff/activities/types/forms.types'
import { useCreateActivityDraft } from '@/api/avenir-esr'
import { useNavigation } from '@/common/composables'
import ActivityTitleFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
import { useToasterStore } from '@/store'
import { AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

interface ActivityDraftCreationModalProps {
  opened: boolean
}

defineProps<ActivityDraftCreationModalProps>()

const emit = defineEmits<{ close: [] }>()

const CREATE_ACTIVITY_FORM_DEFAULT_VALUES = { title: '' }

const { t } = useI18n()
const { navigateToStaffActivitiesEditNationalActivity } = useNavigation()
const { mutate, isPending } = useCreateActivityDraft()
const { addErrorMessage } = useToasterStore()

const form = useForm({
  defaultValues: {
    ...CREATE_ACTIVITY_FORM_DEFAULT_VALUES,
  } satisfies ActivityDraftCreationFormData,
  onSubmit: ({ value }) => {
    mutate({ data: { title: value.title } }, {
      onSuccess: (response) => {
        emit('close')
        navigateToStaffActivitiesEditNationalActivity({ id: response.draftId, mode: 'add' })
      },
      onError: (error: BaseApiException) => {
        addErrorMessage({ title: t('staff.activities.views.ActivitiesView.ActivityDraftCreationModal.error'), description: error.message })
      },
    })
  },
})

const isFormValid = computed(() => form.useStore(s => s.isValid && !s.isValidating && s.isDirty).value)

function onClose () {
  form.reset({ ...CREATE_ACTIVITY_FORM_DEFAULT_VALUES })
  emit('close')
}
</script>

<template>
  <AvModal
    :opened="opened"
    :close-button-label="t('staff.activities.views.ActivitiesView.ActivityDraftCreationModal.closeButtonLabel')"
    :confirm-button-label="t('staff.activities.views.ActivitiesView.ActivityDraftCreationModal.confirmButtonLabel')"
    :confirm-button-disabled="!isFormValid"
    :confirm-button-icon="MDI_ICONS.ARROW_RIGHT"
    :is-loading="isPending"
    data-testid="activity-draft-creation-modal"
    @close="onClose"
    @confirm="form.handleSubmit()"
  >
    <template #header>
      <span class="b2-bold av-pt-md">
        {{ t('staff.activities.views.ActivitiesView.ActivityDraftCreationModal.title') }}
      </span>
    </template>

    <form
      novalidate
      @submit.prevent="form.handleSubmit()"
    >
      <ActivityTitleFormField
        :form="form"
        data-testid="activity-title-form-field"
      />
    </form>
  </AvModal>
</template>
