<script setup lang="ts">
import type { UpdateDeclaredSkillForm } from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/use-update-declared-skill-form/use-update-declared-skill-form'
import ValorizeToggle from '@/features/student/global/components/interaction/toggles/ValorizeToggle/ValorizeToggle.vue'
import { markRaw, useAttrs } from 'vue'

interface DeclaredSkillValorizationToggleFormFieldProps {
  form: UpdateDeclaredSkillForm
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
        id="declared-skill-valorization"
        name="valorized"
        :model-value="field.state.value"
        @update:model-value="value => handleChange(value, field.handleChange)"
      />
    </template>
  </FormField>
</template>
