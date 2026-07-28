<script setup lang="ts">
import type { UpdateDeclaredSkillForm } from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/use-update-declared-skill-form/use-update-declared-skill-form'
import type {
  UpdateSelfKnowledgeCategoryElementForm
} from '@/features/student/selfKnowledge/types/forms.types'
import type { UpdateTraceForm } from '@/features/student/traces/types/forms.types'
import ValorizeToggle from '@/features/student/global/components/interaction/toggles/ValorizeToggle/ValorizeToggle.vue'
import { markRaw, useAttrs } from 'vue'

interface DeclaredSkillValorizationToggleFormFieldProps {
  form: UpdateDeclaredSkillForm | UpdateSelfKnowledgeCategoryElementForm | UpdateTraceForm
  description?: string
}

const { form, description } = defineProps<DeclaredSkillValorizationToggleFormFieldProps>()

const emit = defineEmits<{
  (event: 'change', payload: boolean): void
}>()

const FormField = markRaw(form.Field)

const attrs = useAttrs()

function handleChange (value: boolean, fieldChange: (value: boolean) => void) {
  fieldChange(value)
  emit('change', value)
}
</script>

<template>
  <FormField name="valorized">
    <template #default="{ field }">
      <ValorizeToggle
        v-bind="attrs"
        id="declared-skill-valorization"
        :description
        name="valorized"
        :model-value="field.state.value"
        @update:model-value="(value: boolean) => handleChange(value, field.handleChange)"
      />
    </template>
  </FormField>
</template>
