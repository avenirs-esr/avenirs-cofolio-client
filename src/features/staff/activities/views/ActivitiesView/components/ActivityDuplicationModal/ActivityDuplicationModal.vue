<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import type { ActivityDuplicationFormData } from '@/features/staff/activities/types/forms.types'
import { EActivityStatus, useDuplicateActivity } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import ActivityTitleFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export interface ActivityDuplicationModalProps {
  opened: boolean
  activityId: string
  activityTitle: string
}

const {
  opened,
  activityId,
  activityTitle
} = defineProps<ActivityDuplicationModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'duplicated'): void
}>()

const DUPLICATE_ACTIVITY_FORM_DEFAULT_VALUES: ActivityDuplicationFormData = { title: activityTitle }

const { t } = useI18n()
const { navigateToStaffActivityCatalog } = useNavigation()
const { getErrorMessage } = useApiErrors()
const { addSuccessMessage, addErrorMessage } = useToasterStore()

const { mutate: duplicateActivity, isPending } = useDuplicateActivity({
  mutation: {
    onSuccess: ({ draftId }) => {
      addSuccessMessage(t('staff.activities.views.ActivitiesView.ActivityDuplicationModal.success'))
      emit('duplicated')
      navigateToStaffActivityCatalog({ id: draftId, status: EActivityStatus.DRAFT })
    },
    onError: (error: BaseApiException) => {
      addErrorMessage({ title: t('staff.activities.views.ActivitiesView.ActivityDuplicationModal.error'), description: getErrorMessage(error) })
    },
  }
})

const form = useForm({
  defaultValues: {
    ...DUPLICATE_ACTIVITY_FORM_DEFAULT_VALUES,
  },
  onSubmit: ({ value }) => {
    duplicateActivity({ activityId, data: { title: value.title } })
  },
})

const isFormValid = computed(() => form.useStore(s => s.isValid && !s.isValidating && s.isDirty).value)

function onClose () {
  form.reset({ ...DUPLICATE_ACTIVITY_FORM_DEFAULT_VALUES })
  emit('close')
}
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    :confirm-button-disabled="!isFormValid"
    :is-loading="isPending"
    data-testid="activity-duplication-modal"
    @close="onClose"
    @confirm="form.handleSubmit()"
  >
    <template #header>
      <span
        class="b2-bold av-pt-md"
        data-testid="activity-duplication-modal-title"
      >
        {{ t('staff.activities.views.ActivitiesView.ActivityDuplicationModal.title') }}
      </span>
    </template>

    <form
      novalidate
      @submit.prevent="form.handleSubmit()"
    >
      <ActivityTitleFormField
        :form="form"
        label-visible
        data-testid="activity-title-form-field"
      />
    </form>
  </ConfirmationModal>
</template>
