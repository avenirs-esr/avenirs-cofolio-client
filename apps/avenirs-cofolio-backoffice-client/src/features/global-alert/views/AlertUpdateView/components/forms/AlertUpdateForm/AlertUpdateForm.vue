<script setup lang="ts">
import type { AlertConfigurationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { FormCancelConfirmButtons } from '@avenirs-esr/shared'
import { useId } from 'vue'
import AlertActiveToggleFormField from '@/features/global-alert/views/AlertUpdateView/components/interactions/formFields/AlertActiveToggleFormField/AlertActiveToggleFormField.vue'
import AlertMessageRichTextEditorFormField from '@/features/global-alert/views/AlertUpdateView/components/interactions/formFields/AlertMessageRichTextEditorFormField/AlertMessageRichTextEditorFormField.vue'
import AlertPeriodFormField from '@/features/global-alert/views/AlertUpdateView/components/interactions/formFields/AlertPeriodFormField/AlertPeriodFormField.vue'
import { useUpdateAlertForm } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'

export interface AlertUpdateFormProps {
  alert?: AlertConfigurationDTO
}

const {
  alert,
} = defineProps<AlertUpdateFormProps>()

const emit = defineEmits<{
  dirtyChange: [value: boolean]
  alertUpdated: []
  cancel: []
}>()

const formId = useId()
const {
  form,
  isActive,
  isFormValid,
  isSubmitting
} = useUpdateAlertForm(alert, () => emit('alertUpdated'))

const isDirty = form.useStore(state => state.isDirty)

function handleSubmit () {
  form.handleSubmit()
}

function handleCancel () {
  emit('cancel')
}

watch(isDirty, value => emit('dirtyChange', value), { immediate: true })
</script>

<template>
  <div class="av-col av-gap-md">
    <form
      :id="formId"
      class="av-col av-gap-md"
      data-testid="alert-update-form__content"
      @submit.prevent="handleSubmit"
    >
      <AlertMessageRichTextEditorFormField :form />

      <AlertActiveToggleFormField :form />

      <AlertPeriodFormField
        :form
        :disabled="isActive"
      />
    </form>

    <div
      class="av-row av-justify-end"
      data-testid="alert-update-form__actions"
    >
      <FormCancelConfirmButtons
        :form="formId"
        :is-submitting="isSubmitting"
        :is-form-valid="isFormValid"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>
