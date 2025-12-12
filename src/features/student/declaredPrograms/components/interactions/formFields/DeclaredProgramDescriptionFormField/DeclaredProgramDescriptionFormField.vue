<script setup lang="ts">
import type { AddDeclaredProgramForm } from '@/features/student/declaredPrograms/types/forms.types'
import DeclaredProgramDescriptionTextarea from '@/features/student/declaredPrograms/components/interactions/inputs/DeclaredProgramDescriptionTextarea/DeclaredProgramDescriptionTextarea.vue'
import { DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH } from '@/features/student/declaredPrograms/config'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface DeclaredProgramDescriptionFormFieldProps {
  form: AddDeclaredProgramForm
}

defineOptions({
  inheritAttrs: false
})

const { form } = defineProps<DeclaredProgramDescriptionFormFieldProps>()
const FormField = markRaw(form.Field)
const descriptionField = form.useField({ name: 'description' })
const { t } = useI18n()

function onUpdateDescription (value: string | undefined) {
  descriptionField.api.handleChange(String(value ?? '').slice(0, DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH))
}
</script>

<template>
  <FormField name="description">
    <template #default="{ field }">
      <DeclaredProgramDescriptionTextarea
        v-bind="$attrs"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateDescription"
      >
        <template #customCaptions>
          <span class="caption-regular">
            {{ t('global.inputs.textarea.limit', { count: (field.state.value?.length ?? 0), maxlength: DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH }) }}
          </span>
        </template>
      </DeclaredProgramDescriptionTextarea>
    </template>
  </FormField>
</template>
