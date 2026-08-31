<script setup lang="ts">
import type { UpdateActivityForm } from '@/features/buildProject/types/forms.types'
import type { UpdateDeclaredSkillForm } from '@/features/declaredSkills/views/StudentUpdateDeclaredSkillView/components/use-update-declared-skill-form/use-update-declared-skill-form'
import type { UpdateDeclaredExperienceForm, UpdateDeclaredProgramForm } from '@/features/personalCareer/types/forms.types'
import type {
  UpdateSelfKnowledgeCategoryElementForm
} from '@/features/selfKnowledge/types/forms.types'
import type { UpdateTraceForm } from '@/features/traces/types/forms.types'
import ValorizeToggle from '@/features/global/components/interaction/toggles/ValorizeToggle/ValorizeToggle.vue'
import { markRaw, useAttrs } from 'vue'

interface DeclaredSkillValorizationToggleFormFieldProps {
  form: UpdateActivityForm | UpdateDeclaredExperienceForm | UpdateDeclaredProgramForm | UpdateDeclaredSkillForm | UpdateSelfKnowledgeCategoryElementForm | UpdateTraceForm
}

const { form } = defineProps<DeclaredSkillValorizationToggleFormFieldProps>()

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
        id="kit-valorization"
        name="valorized"
        :model-value="field.state.value"
        @update:model-value="(value: boolean) => handleChange(value, field.handleChange)"
      />
    </template>
  </FormField>
</template>
