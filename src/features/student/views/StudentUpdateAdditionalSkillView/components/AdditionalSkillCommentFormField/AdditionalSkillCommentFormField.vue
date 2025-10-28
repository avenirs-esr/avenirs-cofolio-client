<script setup lang="ts">
import type { UpdateAdditionalSkillForm } from '@/features/student/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import { AvInput } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface AdditionalSkillCommentFormFieldProps {
  form: UpdateAdditionalSkillForm
}

defineProps<AdditionalSkillCommentFormFieldProps>()
const { t } = useI18n()
</script>

<template>
  <form.Field name="comment">
    <template #default="{ field }">
      <AvInput
        v-bind="$attrs"
        id="skill-comment"
        :model-value="(field.state.value ?? '').slice(0, 400)"
        :label="t('student.views.studentAdditionalSkillView.tabs.details.commentTitle')"
        label-class="caption-regular"
        :maxlength="400"
        is-textarea
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="field.handleChange"
      >
        <template #customCaptions>
          <span class="caption-regular">
            {{ t('global.inputs.limit', { count: (field.state.value?.length ?? 0), maxlength: 400 }) }}
          </span>
        </template>
      </AvInput>
    </template>
  </form.Field>
</template>
