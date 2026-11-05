<script setup lang="ts">
import type { AnyFieldApi } from '@avenirs-esr/shared'
import type { AlertUpdateForm, AlertUpdateFormData } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'
import { markRaw } from 'vue'
import AlertMessageRichTextEditor from '@/features/global-alert/components/interactions/inputs/AlertMessageRichTextEditor/AlertMessageRichTextEditor.vue'

export interface AlertMessageRichTextEditorFormFieldProps {
  form: AlertUpdateForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<AlertMessageRichTextEditorFormFieldProps>()

const FormField = markRaw(form.Field)
type FieldApi = AnyFieldApi<AlertUpdateFormData, 'message'>
type FieldValue = AlertUpdateFormData['message']

function handleChange (field: FieldApi, value: FieldValue) {
  field.handleChange(value !== '<p></p>' ? value : '')
}
</script>

<template>
  <FormField name="message">
    <template #default="{ field }">
      <AlertMessageRichTextEditor
        v-bind="$attrs"
        id="message"
        :model-value="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        @update:model-value="(value?: string) => handleChange(field, value ?? '')"
      />
    </template>
  </FormField>
</template>
