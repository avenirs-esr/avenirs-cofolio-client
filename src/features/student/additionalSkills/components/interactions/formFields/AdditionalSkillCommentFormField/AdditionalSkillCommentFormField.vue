<script setup lang="ts">
import type { UpdateAdditionalSkillForm } from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import { AvInput } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface AdditionalSkillCommentFormFieldProps {
  form: UpdateAdditionalSkillForm
}

const { form } = defineProps<AdditionalSkillCommentFormFieldProps>()
const FormField = markRaw(form.Field)

const { t } = useI18n()
</script>

<template>
  <FormField name="description">
    <template #default="{ field }">
      <AvInput
        v-bind="$attrs"
        id="skill-comment"
        :model-value="(field.state.value ?? '').slice(0, 400)"
        :label="t('student.views.studentAdditionalSkillView.tabs.details.descriptionTitle')"
        label-class="caption-regular"
        :maxlength="400"
        is-textarea
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="(v) => form.setFieldValue('description', String(v ?? '').slice(0, 400))"
      >
        <template #customCaptions>
          <span class="caption-regular">
            {{ t('global.inputs.limit', { count: (field.state.value?.length ?? 0), maxlength: 400 }) }}
          </span>
        </template>
      </AvInput>
    </template>
  </FormField>
</template>
