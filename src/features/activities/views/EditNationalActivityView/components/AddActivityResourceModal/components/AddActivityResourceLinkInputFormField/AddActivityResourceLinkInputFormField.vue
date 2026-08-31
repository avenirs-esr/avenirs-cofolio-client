<script setup lang="ts">
import type { AddActivityResourceForm } from '@/features/activities/types/forms.types'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import { ACTIVITY_RESOURCE_LINK_MAX_LENGTH } from '@/features/activities/config'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface AddActivityResourceLinkInputFormFieldProps {
  form: AddActivityResourceForm
}

const { form } = defineProps<AddActivityResourceLinkInputFormFieldProps>()

const { t } = useI18n()
const FormField = markRaw(form.Field)
</script>

<template>
  <FormField name="link">
    <template #default="{ field }">
      <Input
        :model-value="field.state.value ?? ''"
        type="url"
        :label="t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.link.label')"
        :placeholder="t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.link.placeholder')"
        :maxlength="ACTIVITY_RESOURCE_LINK_MAX_LENGTH"
        :prefix-icon="MDI_ICONS.LINK"
        :error-message="field.state.meta.errors.filter(Boolean).join(', ')"
        data-testid="add-activity-resource-link-input"
        @blur="field.handleBlur"
        @update:model-value="(value) => field.handleChange((value ?? '').toString())"
      />
    </template>
  </FormField>
</template>
