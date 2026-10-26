<script setup lang="ts">
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { AnyFieldApi } from '@/common/types'
import type { EditActivityForm, EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import Toggle from '@/common/components/interaction/toggles/Toggle/Toggle.vue'

interface ActivityAssessmentCommentFormFieldProps extends AvInteractiveProps {
  form: EditActivityForm
}

const {
  form,
  disabled = false,
  disabledTooltip
} = defineProps<ActivityAssessmentCommentFormFieldProps>()

const emit = defineEmits<{
  change: []
}>()

const FormField = markRaw(form.Field)
type FieldApi = AnyFieldApi<EditActivityFormData, 'assessmentComment'>
type FieldValue = EditActivityFormData['assessmentComment']

const { t } = useI18n()

function onToggle (field: FieldApi, value: FieldValue) {
  field.handleChange(value)
  emit('change')
}
</script>

<template>
  <FormField name="assessmentComment">
    <template #default="{ field }">
      <Toggle
        id="assessment-comment-toggle"
        :model-value="field.state.value"
        :description="t('staff.activities.views.EditNationalActivityView.ActivityAssessmentCommentFormField.description')"
        :disabled
        :disabled-tooltip
        @update:model-value="(value: FieldValue) => onToggle(field, value)"
      />
    </template>
  </FormField>
</template>
