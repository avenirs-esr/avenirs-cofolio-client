<script setup lang="ts">
import type { UpdateAdditionalSkillForm } from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import AdditionalSkillCommentInput
  from '@/features/student/additionalSkills/components/interactions/inputs/AdditionalSkillCommentInput/AdditionalSkillCommentInput.vue'
import { ADDITIONAL_SKILL_COMMENT_MAX_LENGTH } from '@/features/student/additionalSkills/config'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface AdditionalSkillCommentFormFieldProps {
  form: UpdateAdditionalSkillForm
}

const { form } = defineProps<AdditionalSkillCommentFormFieldProps>()
const FormField = markRaw(form.Field)
const commentField = form.useField({ name: 'description' })

function onUpdateComment (value: string | undefined) {
  commentField.api.handleChange(String(value ?? '').slice(0, ADDITIONAL_SKILL_COMMENT_MAX_LENGTH))
}
const { t } = useI18n()
</script>

<template>
  <FormField name="description">
    <template #default="{ field }">
      <AdditionalSkillCommentInput
        v-bind="$attrs"
        id="skill-comment"
        :model-value="(field.state.value ?? '').slice(0, ADDITIONAL_SKILL_COMMENT_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateComment"
      >
        <template #customCaptions>
          <span class="caption-regular">
            {{ t('global.inputs.textarea.limit', { count: (field.state.value?.length ?? 0), maxlength: ADDITIONAL_SKILL_COMMENT_MAX_LENGTH }) }}
          </span>
        </template>
      </AdditionalSkillCommentInput>
    </template>
  </FormField>
</template>
