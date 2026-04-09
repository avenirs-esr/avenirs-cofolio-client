<script setup lang="ts">
import type { DeclaredSkillForm } from '@/features/student/declaredSkills/types/forms.types'
import type { UpdateDeclaredSkillForm } from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/use-update-declared-skill-form/use-update-declared-skill-form'
import DeclaredSkillReflectionInput
  from '@/features/student/declaredSkills/components/interactions/inputs/DeclaredSkillReflectionInput/DeclaredSkillReflectionInput.vue'
import { DECLARED_SKILL_REFLECTION_MAX_LENGTH } from '@/features/student/declaredSkills/config'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface DeclaredSkillReflectionFormFieldProps {
  form: UpdateDeclaredSkillForm | DeclaredSkillForm
}

const { form } = defineProps<DeclaredSkillReflectionFormFieldProps>()
const FormField = markRaw(form.Field)
const { t } = useI18n()
</script>

<template>
  <FormField name="reflection">
    <template #default="{ field }">
      <DeclaredSkillReflectionInput
        v-bind="$attrs"
        id="skill-reflection"
        :model-value="(field.state.value ?? '').slice(0, DECLARED_SKILL_REFLECTION_MAX_LENGTH)"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="(value) => field.handleChange(String(value ?? '').slice(0, DECLARED_SKILL_REFLECTION_MAX_LENGTH))"
      >
        <template #maxLengthCaption>
          <span class="caption-regular">
            {{
              t('global.inputs.textarea.limit', { count: (field.state.value?.length ?? 0), maxlength: DECLARED_SKILL_REFLECTION_MAX_LENGTH })
            }}
          </span>
        </template>
      </DeclaredSkillReflectionInput>
    </template>
  </FormField>
</template>
