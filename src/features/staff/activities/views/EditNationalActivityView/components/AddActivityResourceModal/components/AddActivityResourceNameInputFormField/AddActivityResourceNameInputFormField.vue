<script setup lang="ts">
import type { AddActivityResourceForm } from '@/features/staff/activities/types/forms.types'
import { ACTIVITY_RESOURCE_NAME_MAX_LENGTH } from '@/features/staff/activities/config'
import { AvInput, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface AddActivityResourceNameInputFormFieldProps {
  form: AddActivityResourceForm
}

const { form } = defineProps<AddActivityResourceNameInputFormFieldProps>()

const { t } = useI18n()
const FormField = markRaw(form.Field)
</script>

<template>
  <FormField name="resourceName">
    <template #default="{ field }">
      <AvInput
        :model-value="field.state.value"
        :label="t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.name.label')"
        :maxlength="ACTIVITY_RESOURCE_NAME_MAX_LENGTH"
        :prefix-icon="MDI_ICONS.ATTACH_FILE"
        :error-message="field.state.meta.errors.filter(Boolean).join(', ')"
        data-testid="add-activity-resource-name-input"
        @blur="field.handleBlur"
        @update:model-value="(value) => field.handleChange((value ?? '').toString())"
      />
    </template>
  </FormField>
</template>
