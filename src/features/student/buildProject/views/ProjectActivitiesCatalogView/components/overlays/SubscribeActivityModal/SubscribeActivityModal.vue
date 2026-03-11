<script lang="ts" setup>
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useSubscribeActivityMutation } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import CancelSubscribeActivityConfirmModal from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/overlays/CancelSubscribeActivityConfirmModal/CancelSubscribeActivityConfirmModal.vue'
import { useToasterStore } from '@/store'
import { AvPeriodInput } from '@avenirs-esr/avenirs-dsav'
import { useForm } from '@tanstack/vue-form'
import { startOfToday } from 'date-fns'
import { useI18n } from 'vue-i18n'

export interface SubscribeActivityModalProps {
  show: boolean
  activity: {
    id: string
    title: string
  }
}

interface SubscribeActivityFormData {
  startDate: string | null
  endDate: string | null
}

const { activity } = defineProps<SubscribeActivityModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'subscribed'): void
}>()

const { t } = useI18n()
const { validateDateInterval, validateRequired } = useFormValidators()
const {
  showModal: showCancelSubscribeConfirmModal,
  displayModal: displayCancelSubscribeConfirmModal,
  hideModal: hideCancelSubscribeConfirmModal
} = useModal()
const { addSuccessMessage, addErrorMessage } = useToasterStore()

const todayDate = startOfToday()

const { mutate: subscribe } = useSubscribeActivityMutation({
  onSuccess: () => {
    addSuccessMessage(t('student.buildProject.activities.views.ProjectActivitiesCatalogView.overlays.ActivitySubscribeModal.success'))
    emit('subscribed')
  },
  onError: (error) => {
    addErrorMessage({
      title: t('student.buildProject.activities.views.ProjectActivitiesCatalogView.overlays.ActivitySubscribeModal.error'),
      description: error.message
    })
  }
})

const form = useForm({
  defaultValues: {
    startDate: null,
    endDate: null
  } as SubscribeActivityFormData,
  validators: {
    onSubmit ({ value }: { value: SubscribeActivityFormData }) {
      const { startDate, endDate } = value
      const validateEndDate = () => {
        if (!startDate) {
          return
        }
        return validateRequired(endDate) || validateDateInterval({
          startDate,
          endDate,
          isOnGoing: true
        })
      }
      const validateStartDate = () => {
        if (!endDate) {
          return
        }
        return validateRequired(startDate) || validateDateInterval({
          startDate,
          endDate,
          isOnGoing: true
        })
      }
      return {
        fields: {
          startDate: validateStartDate(),
          endDate: validateEndDate()
        }
      }
    }
  },
  onSubmit: ({ value }: { value: SubscribeActivityFormData }) => {
    const { startDate, endDate } = value
    const period = startDate && endDate
      ? { startDate, endDate }
      : undefined

    subscribe({
      activityId: activity.id,
      subscribeDeclaredActivityRequest: {
        period
      }
    }, {
      onSuccess: () => {
        form.reset()
      }
    })
  }
})

const startDateField = form.useField({ name: 'startDate' })
const startDateValue = computed(() => startDateField.state.value.value ?? '')
const endDateField = form.useField({ name: 'endDate' })
const endDateValue = computed(() => endDateField.state.value.value ?? '')
const startDateErrorMessage = computed(() => startDateField.state.value.meta.errors?.join(', '))
const endDateErrorMessage = computed(() => endDateField.state.value.meta.errors?.join(', '))

const isFormValid = computed(() => {
  const state = form.useStore(s => s)
  return state.value.isValid && !state.value.isValidating
})

const isFormDirty = computed(() => {
  const state = form.useStore(s => s)
  return state.value.isDirty
})

function onConfirmCancelSubscribe () {
  hideCancelSubscribeConfirmModal()
  form.reset()
  setTimeout(() => {
    emit('cancel')
  }, 10)
}

function onCancelSubscribeModal () {
  if (isFormDirty.value) {
    displayCancelSubscribeConfirmModal()
  }
  else {
    emit('cancel')
  }
}

function onChangeStartDate (date: string) {
  startDateField.api.handleChange(date)
}

function onChangeEndDate (date: string) {
  endDateField.api.handleChange(date)
}
</script>

<template>
  <ConfirmationModal
    :show="show"
    :confirm-button-disabled="!isFormValid"
    data-testid="subscribe-activity-modal"
    @close="onCancelSubscribeModal"
    @confirm="form.handleSubmit"
  >
    <template #header>
      <div
        class="av-row av-flex-fill"
        data-testid="subscribe-activity-modal__header"
      >
        <span
          class="b2-bold av-text-text1"
          data-testid="subscribe-activity-modal__title"
        >
          {{ t('student.buildProject.activities.views.ProjectActivitiesCatalogView.overlays.ActivitySubscribeModal.title', { title: activity.title }) }}
        </span>
      </div>
    </template>

    <AvPeriodInput
      data-testid="subscribe-activity-modal__period-input"
      :label="t('student.buildProject.activities.views.ProjectActivitiesCatalogView.overlays.ActivitySubscribeModal.period.label')"
      :start-model-value="startDateValue"
      :end-model-value="endDateValue"
      :start-min-date="todayDate"
      :start-error-message="startDateErrorMessage"
      :end-error-message="endDateErrorMessage"
      @update:start-model-value="onChangeStartDate"
      @update:end-model-value="onChangeEndDate"
    />

    <CancelSubscribeActivityConfirmModal
      :show="showCancelSubscribeConfirmModal"
      @cancel="hideCancelSubscribeConfirmModal"
      @confirm="onConfirmCancelSubscribe"
    />
  </ConfirmationModal>
</template>
