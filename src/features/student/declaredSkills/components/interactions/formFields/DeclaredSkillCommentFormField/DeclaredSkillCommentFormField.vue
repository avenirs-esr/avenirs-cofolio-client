<script setup lang="ts">
import type { UpdateDeclaredSkillForm } from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/use-update-declared-skill-form/use-update-declared-skill-form'
import DeclaredSkillCommentInput
  from '@/features/student/declaredSkills/components/interactions/inputs/DeclaredSkillCommentInput/DeclaredSkillCommentInput.vue'
import { DECLARED_SKILL_COMMENT_MAX_LENGTH } from '@/features/student/declaredSkills/config'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface DeclaredSkillCommentFormFieldProps {
  form: UpdateDeclaredSkillForm
}

const { form } = defineProps<DeclaredSkillCommentFormFieldProps>()
const FormField = markRaw(form.Field)
const commentField = form.useField({ name: 'description' })

function onUpdateComment (value: string | undefined) {
  commentField.api.handleChange(String(value ?? '').slice(0, DECLARED_SKILL_COMMENT_MAX_LENGTH))
}
const { t } = useI18n()
</script>

<template>
  <FormField name="description">
    <template #default="{ field }">
      <DeclaredSkillCommentInput
        v-bind="$attrs"
        id="skill-comment"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_SKILL_COMMENT_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateComment"
      >
        <template #customCaptions>
          <span class="caption-regular">
            {{ t('global.inputs.textarea.limit', { count: (field.state.value?.length ?? 0), maxlength: DECLARED_SKILL_COMMENT_MAX_LENGTH }) }}
          </span>
        </template>
      </DeclaredSkillCommentInput>
    </template>
  </FormField>
</template>
