<script setup lang="ts">
import type { AnyFieldApi } from '@avenirs-esr/shared'
import type { AlertUpdateForm, AlertUpdateFormData } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'
import { markRaw } from 'vue'
import AlertActiveToggle from '@/features/global-alert/components/interactions/inputs/AlertActiveToggle/AlertActiveToggle.vue'

export interface AlertActiveToggleFormFieldProps {
  form: AlertUpdateForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<AlertActiveToggleFormFieldProps>()

const FormField = markRaw(form.Field)
type FieldApi = AnyFieldApi<AlertUpdateFormData, 'active'>
type FieldValue = AlertUpdateFormData['active']

function handleChange (field: FieldApi, value: FieldValue) {
  field.handleChange(value)
}
</script>

<template>
  <FormField name="active">
    <template #default="{ field }">
      <AlertActiveToggle
        v-bind="$attrs"
        id="active"
        name="active"
        :model-value="field.state.value"
        @update:model-value="(value: boolean) => handleChange(field, value)"
      />
    </template>
  </FormField>
</template>
