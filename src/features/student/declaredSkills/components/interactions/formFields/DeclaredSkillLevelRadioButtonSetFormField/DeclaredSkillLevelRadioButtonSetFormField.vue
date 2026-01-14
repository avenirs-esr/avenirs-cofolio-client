<script setup lang="ts">
import type { DeclaredSkillForm, UpdateDeclaredSkillForm } from '@/features/student/declaredSkills/types/forms.types'
import { EDeclaredSkillLevel } from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'
import DeclaredSkillLevelRadioButtonSet from '@/features/student/declaredSkills/components/interactions/radios/DeclaredSkillLevelRadioButtonSet/DeclaredSkillLevelRadioButtonSet.vue'
import { markRaw } from 'vue'

interface DeclaredSkillLevelFormFieldProps {
  form: UpdateDeclaredSkillForm | DeclaredSkillForm
}

const { form } = defineProps<DeclaredSkillLevelFormFieldProps>()
const FormField = markRaw(form.Field)
</script>

<template>
  <FormField name="level">
    <template #default="{ field }">
      <DeclaredSkillLevelRadioButtonSet
        v-bind="$attrs"
        :model-value="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        @update:model-value="(value) => {
          if (typeof value === 'string' && isEnumMember(EDeclaredSkillLevel, value)) {
            field.handleChange(value)
          }
        }"
        @blur="field.handleBlur"
      />
    </template>
  </FormField>
</template>
